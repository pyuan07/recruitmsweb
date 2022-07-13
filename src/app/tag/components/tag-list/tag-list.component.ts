import { ObjectState } from 'src/app/_shared/enum/enum';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Tag } from "src/app/models/tag-model";
import { TagService } from "src/app/services/tag.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user-model';
import { X } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})

export class TagListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'totalUsed' ,'objectState','actions'];
  dataSource!: MatTableDataSource<Tag>; 
  filterText: String = '';
  filterState: String = 'ALL';
  tagList!: Tag[];
  currentUser!: User;
  isAdmin: boolean = false;
  ownCompany?: Tag;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _tagService: TagService, private _tokenStorageService: TokenStorageService, private router: Router) {  
    this.isAdmin = this._tokenStorageService.isAdmin();
  }

  ngOnInit(): void {
    this.currentUser = this._tokenStorageService.getUser()!;
    this.getAllTag();
  }

  private getAllTag(){
    this._tagService.getAll().subscribe({
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
      this.getAllTag();
    }
    else{
      this._tagService.getByObjState(this.filterState).subscribe({
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

  goToCreateTag(){
    this.router.navigate(['/tag/create']);
  }
  
  deleteTag(id: string, name: string){
    Swal.fire({
      title: 'Do you want to terminate this tag?\n Name: ' + name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._tagService.delete(id).subscribe({
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
