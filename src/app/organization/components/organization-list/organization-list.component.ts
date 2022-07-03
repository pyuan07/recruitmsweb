import { ObjectState } from 'src/app/_shared/enum/enum';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Organization } from "src/app/models/organization-model";
import { OrganizationService } from "src/app/services/organization.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user-model';
import { X } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})

export class OrganizationListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'email' ,'country', 'objectState','actions'];
  dataSource!: MatTableDataSource<Organization>;
  filterText: String = '';
  filterState: String = 'ALL';
  organizationList!: Organization[];
  currentUser!: User;
  ownCompany?: Organization;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _organizationService: OrganizationService, private _tokenStorageService: TokenStorageService, private router: Router) {  
    
  }

  ngOnInit(): void {
    this.currentUser = this._tokenStorageService.getUser()!;
    this.getAllOrganization();
  }

  private getAllOrganization(){
    this._organizationService.getAll().subscribe({
      next: data => {
        this.ownCompany = data.find(organization => organization.owner.userId == this.currentUser.userId);
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
      if(this._tokenStorageService.isEmployer()){
        if(this.ownCompany != null){
          this.router.navigate(['/organization/details/' + this.ownCompany.organizationId]);
        }
        else{
          this.goToCreateOrganization();
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
      return data.name.toLowerCase().includes(filter) || (data.name != undefined && data.name.toLowerCase().includes(filter));
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByState(){
    if(this.filterState == 'ALL'){
      this.getAllOrganization();
    }
    else{
      this._organizationService.getByObjState(this.filterState).subscribe({
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

  goToCreateOrganization(){
    this.router.navigate(['/organization/create']);
  }
  
  deleteOrganization(id: string, name: string){
    Swal.fire({
      title: 'Do you want to terminate this organization?\n Title: ' + name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._organizationService.delete(id).subscribe({
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
        })
      }
    })
  }

}
