
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Organization } from 'src/app/models/organization-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { CountryService } from 'src/app/services/country.service';
import { Country } from 'src/app/models/country-model';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.css']
})
export class OrganizationEditComponent implements OnInit {
  organizationFrom!: Organization;
  countryList!: Country[];
  currentUser!: User;
  isAdmin: boolean = false;
  isEmployer: boolean = false;
  employerList!: User[];
;
  constructor(
      private _organizationService: OrganizationService, 
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
      this.getOrganizationDetails(this.route.snapshot.params['id']);
      this.getAllCountries();
      this.getAllEmployers();
    }
  
    private getOrganizationDetails(id: string){
      this._organizationService.getById(id).subscribe({
        next: data => {
          this.organizationFrom = data;
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
      this._organizationService.update(this.organizationFrom!).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'Organization edited Successfully!'
          });
          window.history.go(-1);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
