import { ObjectState } from 'src/app/_shared/enum/enum';
import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Vacancy } from "src/app/models/vacancy-model";
import { VacancyService } from "src/app/services/vacancy.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';


@Component({
  selector: 'app-vacancy-list',
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.css']
})

export class VacancyListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'organization', 'country', 'objectState', 'actions'];
  dataSource!: MatTableDataSource<Vacancy>;
  filterText: String = '';
  filterState: String = 'ALL';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _vacancyService: VacancyService, private _tokenStorageService: TokenStorageService,private router: Router) {  
    
  }

  ngOnInit(): void {
    this.getAllVacancy();
  }

  private getAllVacancy(){
    this._vacancyService.getAll().subscribe({
      next: data => {
        if(this._tokenStorageService.isAdmin())
        {
          this.dataSource = new MatTableDataSource(data);
        }
        else if(this._tokenStorageService.isEmployer())
        {
          this.dataSource = new MatTableDataSource(data.filter(data => data.organization.owner.userId == this._tokenStorageService.getUser()!.userId));
        }
        else
        {
          this.dataSource = new MatTableDataSource(data.filter(data => data.objectState == ObjectState.ACTIVE));
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
      return data.name.toLowerCase().includes(filter) || (data.name != undefined && data.name.toLowerCase().includes(filter));
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByState(){
    if(this.filterState == 'ALL'){
      this.getAllVacancy();
    }
    else{
      this._vacancyService.getByObjState(this.filterState).subscribe({
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

  goToCreateVacancy(){
    this.router.navigate(['/vacancy/create']);
  }
  
  deleteVacancy(id: number, name: string){
    Swal.fire({
      title: 'Do you want to terminate this vacancy?\n Title: ' + name,
      text: "All application related to this vacancy will be updated to CANCEL status after you terminated the vacancy.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._vacancyService.delete(id).subscribe({
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
