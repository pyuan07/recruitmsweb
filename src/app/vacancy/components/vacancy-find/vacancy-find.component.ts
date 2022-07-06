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
  selector: 'app-vacancy-find',
  templateUrl: './vacancy-find.component.html',
  styleUrls: ['./vacancy-find.component.css']
})

export class VacancyFindComponent implements OnInit {

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
    this._vacancyService.getByObjState("ACTIVE").subscribe({
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

  gotoDetailsPage(id: number){
    this.router.navigate(['/vacancy/details/' + id]);
  }
}