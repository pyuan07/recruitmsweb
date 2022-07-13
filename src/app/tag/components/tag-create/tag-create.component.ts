import { TagService } from '../../../services/tag.service';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country-model';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ObjectState } from 'src/app/_shared/enum/enum';


@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent implements OnInit {

  currentUser!: User;
  isAdmin: boolean = false;
  isEmployer: boolean = false;


  constructor(  private _tagService: TagService, 
                private _countryService: CountryService,
                private _userService: UserService,
                private router: Router,
                private tokenService:TokenStorageService, 
              ) {  
    this.currentUser = this.tokenService.getUser()!;
    this.isAdmin = this.tokenService.isAdmin();
    this.isEmployer = this.tokenService.isEmployer();

  }

  ngOnInit(): void {
    if(!this.isAdmin){
      this.router.navigate(['/tag']);
    }
  }


  onSubmit(createForm: NgForm): void {
    createForm.value.tagType = 1;
    createForm.value.totalUsed = 0;
    this._tagService.create(createForm.value).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Tag Created Successfully!'
        });
        if(this.isAdmin) this.router.navigate(['tag']);
        if(this.isEmployer) this.router.navigate(['home']);

      },
      error: err => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }
}
