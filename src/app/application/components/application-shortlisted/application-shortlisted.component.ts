import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Application } from "src/app/models/application-model";
import { ApplicationService } from "src/app/services/application.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user-model';
import { ApplicationStatus } from 'src/app/_shared/enum/enum';


@Component({
  selector: 'app-application-shortlisted',
  templateUrl: './application-shortlisted.component.html',
  styleUrls: ['./application-shortlisted.component.css']
})

export class ApplicationShortlistedComponent implements OnInit {

  displayedColumns: string[] = ['vacancyName', 'candidateName', 'expectedSalary', 'matchedTag', 'remarks' ,'status', 'actions'];

  dataSource!: MatTableDataSource<Application>;
  filterText: string = '';
  // filterState: string = 'ALL';
  filterStatus: string = 'ALL';

  currentUser!: User;
  isCandidate: boolean = false;
  isEmployer: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(  private _applicationService: ApplicationService, 
                private _tokenStorageService: TokenStorageService,
                private router: Router) {  
    this.isCandidate = this._tokenStorageService.isCandidate();
    this.isEmployer = this._tokenStorageService.isEmployer();
    this.currentUser = this._tokenStorageService.getUser()!;
  }

  ngOnInit(): void {
    this.getShortlistedApplication();
    if(this.isCandidate){
      this.displayedColumns = ['vacancyName', 'expectedSalary', 'matchedTag','remarks' ,'status', 'objectState', 'actions'];
    }
  }

  private getShortlistedApplication(){
    this._applicationService.getAll().subscribe({
      next: data => {
        
        data = data.filter(data => data.status.toString() == "SHORTLISTED");

        data.forEach((data) => {
          data.matchedTag = data.resume.tags.filter(resumeTag => data.vacancy.tags.some(tag => tag.name == resumeTag.name)).length;
        });

        if(this.isCandidate){ 
          this.dataSource = new MatTableDataSource(data.filter(data => data.candidate.userId == this.currentUser.userId));
        }
        else if(this.isEmployer){
          this.dataSource = new MatTableDataSource(data.filter(data => data.vacancy.organization.owner.userId == this.currentUser.userId));
        }
        else{
          this.dataSource = new MatTableDataSource(data);
        }

        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }
  
  applyFilter() {
    const filterValue = this.filterText;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    //Specific the filter column
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.candidate.username.toLowerCase().includes(filter) || (data.candidate.username != undefined && data.candidate.username.toLowerCase().includes(filter));
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // filterByState(){
  //   if(this.filterState == 'ALL'){
  //     this.getAllApplication();
  //   }
  //   else{
  //     this._applicationService.getByObjState(this.filterState).subscribe({
  //       next: data => {
  //         this.dataSource = new MatTableDataSource(data);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       },
  //       error: (err: any) => {
  //         Swal.fire("Error", err.error.message, "error");
  //       }
  //     });
  //   }
    
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  filterByStatus(){

  }

  goToCreateApplication(){
    this.router.navigate(['/application/create']);
  }

  scheduleApplication(id:number){

  }
  
  // deleteApplication(id: number, name: string){
  //   Swal.fire({
  //     title: 'Do you want to terminate this application?\n Title: ' + name,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._applicationService.delete(id).subscribe({
  //         next: data => {
  //           if(data){
  //             Swal.fire("Terminated Successfully", "", "success");
  //             window.location.reload();
  //           }
  //           else{
  //             Swal.fire("Failed to Terminate", "Something went wrong...", "error");
  //           }
  //         },
  //         error: (err: any) => {
  //           Swal.fire("Error", err.error.message, "error");
  //         }
  //       });
  //     }
  //   });
  // }

}
