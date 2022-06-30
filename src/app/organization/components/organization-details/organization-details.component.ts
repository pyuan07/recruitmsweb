
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

  organizationFrom!: Organization;

  constructor(private _organizationService: OrganizationService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this._organizationService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => {
          this.organizationFrom = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['organization/edit', this.organizationFrom!.organizationId])
    }

    deleteOrganization(){
      Swal.fire({
        title: 'Do you want to terminate this organization?\n Title: ' + this.organizationFrom!.name,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._organizationService.delete(this.organizationFrom!.organizationId).subscribe({
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
