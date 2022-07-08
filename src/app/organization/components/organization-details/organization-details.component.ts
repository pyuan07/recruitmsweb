import { TokenStorageService } from './../../../services/token-storage.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization } from 'src/app/models/organization-model';
import { OrganizationService } from 'src/app/services/organization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

  organizationForm!: Organization;
  isAdmin: boolean = false;
  isEmployer: boolean = false;
  isCandidate: boolean = false;

  constructor(private _organizationService: OrganizationService, private _tokenService: TokenStorageService, private route: ActivatedRoute ,private router: Router) {  
    this.isAdmin = this._tokenService.isAdmin();
    this.isEmployer = this._tokenService.isEmployer();
    this.isCandidate = this._tokenService.isCandidate();
  }
   
    ngOnInit(): void {
      this._organizationService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => {
          this.organizationForm = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['organization/edit', this.organizationForm!.organizationId])
    }

    deleteOrganization(){
      Swal.fire({
        title: 'Do you want to terminate this organization?\n Title: ' + this.organizationForm!.name,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._organizationService.delete(this.organizationForm!.organizationId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['organization'])
                
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
