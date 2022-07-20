import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Resume } from "src/app/models/resume-model";
import { ResumeService } from "src/app/services/resume.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user-model';


@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.css']
})

export class ResumeListComponent implements OnInit {

  displayedColumns: string[] = ['candidateName', 'totalExperienceYear', 'expectedSalary' ,'country', 'objectState', 'actions'];
  dataSource!: MatTableDataSource<Resume>;
  filterText: String = '';
  filterState: String = 'ALL';

  currentUser!: User;
  myResume?: Resume;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _resumeService: ResumeService, private _tokenStorageService: TokenStorageService,private router: Router) {  
    
  }

  ngOnInit(): void {
    this.currentUser = this._tokenStorageService.getUser()!;
    this.getAllResume();
  }

  private getAllResume(){
    this._resumeService.getAll().subscribe({
      next: data => {
        this.myResume = data.find(resume => resume.candidate.userId == this.currentUser.userId && resume.objectState.toString() == 'ACTIVE');
        this.dataSource = new MatTableDataSource(data);
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.checkUser();
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

  private checkUser(){
    if(! this._tokenStorageService.isAdmin()){
      if(this._tokenStorageService.isCandidate()){
        if(this.myResume != null){
          this.router.navigate(['/resume/details/' + this.myResume.resumeId]);
        }
        else{
          this.goToCreateResume();
        }
      }
      else{
        this.router.navigate(['home']);
      }
    }
  }
  
  applyFilter() {
    const filterValue = this.filterText;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //Specific the filter column
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.candidate.fullName.toLowerCase().includes(filter) || (data.candidate.fullName != undefined && data.candidate.fullName.toLowerCase().includes(filter));
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByState(){
    if(this.filterState == 'ALL'){
      this.getAllResume();
    }
    else{
      this._resumeService.getByObjState(this.filterState).subscribe({
        next: data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToCreateResume(){
    this.router.navigate(['/resume/create']);
  }
  
  deleteResume(id: string, name: string){
    Swal.fire({
      title: 'Do you want to terminate this resume?\n Title: ' + name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._resumeService.delete(id).subscribe({
          next: data => {
            if(data){
              Swal.fire("Terminated Successfully", "", "success");
              window.location.reload();
            }
            else{
              Swal.fire("Failed to Terminate", "Something went wrong...", "error");
            }
          },
          error: (err: any) => {
            Swal.fire("Error", err.error.message, "error");
          }
        });
      }
    });
  }

}
