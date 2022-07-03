import { OrganizationCreateRequest } from './../../../models/request/organization-create-request';
import { OrganizationService } from '../../../services/organization.service';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country-model';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Organization } from 'src/app/models/organization-model';
import { ObjectState } from 'src/app/_shared/enum/enum';


@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
  styleUrls: ['./organization-create.component.css']
})
export class OrganizationCreateComponent implements OnInit {

  organizationRequest!: OrganizationCreateRequest;

  countryList!: Country[];
  employerList!: User[];
  currentUser!: User;
  isAdmin: boolean = false;
  isEmployer: boolean = false;


  constructor(  private _organizationService: OrganizationService, 
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
    this.getAllCountries();
    this.getAllEmployers();
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

  onSubmit(createForm: NgForm): void {
    this.organizationRequest = createForm.value;

    if(this.isEmployer){
      this.organizationRequest.owner = this.currentUser.userId;
      this.organizationRequest.objectState = ObjectState.ACTIVE;
    }
   
    this._organizationService.create(this.organizationRequest).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Organization Created Successfully!'
        });
        if(this.isAdmin) this.router.navigate(['organization']);
        if(this.isEmployer) this.router.navigate(['home']);

      },
      error: err => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }
}
