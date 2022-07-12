import { ApplicationStatus } from './../../../_shared/enum/enum';
import { Organization } from './../../../models/organization-model';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'src/app/models/application-model';
import { ApplicationService } from 'src/app/services/application.service';
import Swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user-model';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  applicationForm!: Application;
  candidateAge: number = 0;
  imageUrl: string = '';
  pdfUrl: string = '';

  isEmployer: boolean = false;
  isCandidate: boolean = false;
  isAdmin: boolean = false;
  currentUser!: User;

  isSalaryInRange: boolean = false;
  isSameCountry: boolean = false;

  isShortlisted: boolean = false;
  isDeclined: boolean = false;
  isCompleted: boolean = false;
  isCancelled: boolean = false;

  constructor(
    private _applicationService: ApplicationService,
    private _tokenStorageService: TokenStorageService,
    private route: ActivatedRoute, 
    private router: Router) {  
    
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
    this.isEmployer = this._tokenStorageService.isEmployer();
    this.currentUser = this._tokenStorageService.getUser()!;

  }
   
    ngOnInit(): void {
      this.getApplicationDetails(this.route.snapshot.params['id']);
    }

    private getApplicationDetails(id: number){
      this._applicationService.getById(id).subscribe({
        next: data => {

          this.imageUrl = environment.apiEndpoint +'/v1/resume/download/image/'+ data.resume.profilePicture;
          this.pdfUrl = environment.apiEndpoint +'/v1/resume/download/pdf/'+ data.resume.resumePdf;
          this.isShortlisted = data.status.toString() == "SHORTLISTED";
          this.isDeclined = data.status.toString() == "DECLINED";
          this.isCompleted = data.status.toString() == "COMPLETED";
          this.isCancelled = data.status.toString() == "CANCEL";

          //Colour same tag
          data.vacancy.tags.forEach((tag) => {
            tag.matched = data.resume.tags.map(x=>x.name).includes(tag.name);
          });

          data.resume.tags.forEach((tag) => {
            tag.matched = data.vacancy.tags.map(x=>x.name).includes(tag.name);
          });

          data.vacancy.tags.sort((n2,n1) => n1.totalUsed - n2.totalUsed);
          data.resume.tags.sort((n2,n1) => n1.totalUsed - n2.totalUsed);

          //Count Age by dob
          var today = new Date();
          var birthDate = new Date(data.candidate.dob);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          this.candidateAge = age;

          //Salary Range
          this.isSalaryInRange = data.resume.salaryExpectation <= data.vacancy.maxSalary && data.resume.salaryExpectation >= data.vacancy.minSalary;
          //Country
          this.isSameCountry = data.resume.country.iso == data.vacancy.country.iso;

          this.applicationForm = data;

          this.viewedApplication();
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    private viewedApplication(){
      if(this.applicationForm.status == ApplicationStatus.APPLIED){
        this.applicationForm.status = ApplicationStatus.VIEWED;
        this._applicationService.update(this.applicationForm);
      }
    }

    gotoEditPage(){
      this.router.navigate(['application/edit', this.applicationForm!.applicationId])
    }

    deleteApplication(){
      Swal.fire({
        title: 'Do you want to terminate this application?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this._applicationService.delete(this.applicationForm.applicationId!).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['application'])
              }
              else{
                Swal.fire("Failed to Terminate", "Something went wrong...", "error");
              }
            },
            error: (err: any) => {
              Swal.fire("Error", err.error.message, "error");
            }
          });
        }
      });
    }

    reloadPage(): void {
      window.location.reload();
    }

    gotoVacancyDetails(){
      window.open("vacancy/details/"+this.applicationForm.vacancy.vacancyId , "_blank");
    }

    gotoResumeDetails(){
      //this.router.navigate(['resume/details/'+ this.applicationForm.resume.resumeId]);
      window.open("resume/details/"+this.applicationForm.resume.resumeId , "_blank");

    }

    gotoOrganizationDetails(){
      //this.router.navigate(['organization/details/'+ this.applicationForm.vacancy.organization.organizationId]);
      window.open("organization/details/"+this.applicationForm.vacancy.organization.organizationId , "_blank");

    }

    shortlistCandidate(){
      this._applicationService.shortlistApplication(this.applicationForm.applicationId!).subscribe({
        next: data => {
          Swal.fire("Shortlisted Successfully", "", "success");
          this.reloadPage();
        },
        error: (err: any) => {
          Swal.fire("Error", err.message, "error");
        }
      });
    }

    declineApplication(){
      this._applicationService.declineApplication(this.applicationForm.applicationId!).subscribe({
        next: data => {
          Swal.fire("Declined Successfully", "", "success");
          this.reloadPage();
        },
        error: (err: any) => {
          Swal.fire("Error", err.message, "error");
        }
      });
    }
}
