
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tag } from 'src/app/models/tag-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { TagService } from 'src/app/services/tag.service';
import { CountryService } from 'src/app/services/country.service';
import { Country } from 'src/app/models/country-model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.css']
})
export class TagEditComponent implements OnInit {
  tagFrom!: Tag;
  countryList!: Country[];
  currentUser!: User;
  isAdmin: boolean = false;
  isEmployer: boolean = false;
  employerList!: User[];
;
  constructor(
      private _tagService: TagService, 
      private _countryService: CountryService,
      private _userService: UserService,
      private tokenService:TokenStorageService, 
      private route: ActivatedRoute ,
      private router: Router
    ) {  
      this.currentUser = this.tokenService.getUser()!;
      this.isAdmin = this.tokenService.isAdmin();
      this.isEmployer = this.tokenService.isEmployer();
  }

    ngOnInit(): void {
      if(!this.isAdmin){
        this.router.navigate(['/tag']);
      }
      this.getTagDetails(this.route.snapshot.params['id']);
      this.getAllCountries();
      this.getAllEmployers();
    }
  
    private getTagDetails(id: string){
      this._tagService.getById(id).subscribe({
        next: data => {
          this.tagFrom = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    private getAllEmployers(){
      this._userService.getByRole("EMPLOYER").subscribe({
        next: data => {
          this.employerList = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  
    private getAllCountries(){
      this._countryService.getAll().subscribe({
        next: data => {
          this.countryList = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    onSubmit(): void {
      this._tagService.update(this.tagFrom!).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'Tag edited Successfully!'
          });
          window.history.go(-1);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
