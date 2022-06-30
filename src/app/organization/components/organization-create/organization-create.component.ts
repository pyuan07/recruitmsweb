import { OrganizationService } from '../../../services/organization.service';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country-model';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create.component.html',
  styleUrls: ['./organization-create.component.css']
})
export class OrganizationCreateComponent implements OnInit {

  countryList!: Country[];
  employerList!: User[];

  constructor(  private _organizationService: OrganizationService, 
                private _countryService: CountryService,
                private _userService: UserService,
                private router: Router
              ) {  
    
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
    this._organizationService.create(createForm.value).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Organization Created Successfully!'
        });
        this.router.navigate(['organization']);
      },
      error: err => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }
}
