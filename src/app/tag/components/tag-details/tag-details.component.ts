import { TokenStorageService } from '../../../services/token-storage.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from 'src/app/models/tag-model';
import { TagService } from 'src/app/services/tag.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {

  tagForm!: Tag;
  isAdmin: boolean = false;
  isEmployer: boolean = false;
  isCandidate: boolean = false;

  constructor(private _tagService: TagService, private _tokenService: TokenStorageService, private route: ActivatedRoute ,private router: Router) {  
    this.isAdmin = this._tokenService.isAdmin();
    this.isEmployer = this._tokenService.isEmployer();
    this.isCandidate = this._tokenService.isCandidate();
  }
   
    ngOnInit(): void {
      this._tagService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => {
          this.tagForm = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['tag/edit', this.tagForm!.tagId])
    }

    deleteTag(){
      Swal.fire({
        title: 'Do you want to terminate this tag?\n Title: ' + this.tagForm!.name,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._tagService.delete(this.tagForm!.tagId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['tag'])
                
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
