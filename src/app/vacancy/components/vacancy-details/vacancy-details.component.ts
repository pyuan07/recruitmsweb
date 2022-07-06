
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { Vacancy } from 'src/app/models/vacancy-model';
import { ResumeService } from 'src/app/services/resume.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.css']
})
export class VacancyDetailsComponent implements OnInit {

  vacancyForm!: Vacancy;
  isAdmin: boolean = false;
  isCandidate: boolean = false;

  currentUser!: User;
  isMyVancacy: boolean = false;

  constructor(  private _vacancyService: VacancyService, 
                private _resumeService: ResumeService,
                private _tokenStorageService: TokenStorageService,
                private route: ActivatedRoute ,
                private router: Router) {  
    this.currentUser = this._tokenStorageService.getUser()!;
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
  }
   
    ngOnInit(): void {
      this.getVacancyDetails(this.route.snapshot.params['id']);
    }

    private getVacancyDetails(id: number){
      this._vacancyService.getById(id).subscribe({
        next: data => {
          this.vacancyForm = data;
          this.isMyVancacy = data.organization.owner.userId == this.currentUser.userId;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['vacancy/edit', this.vacancyForm!.vacancyId])
    }

    applyVacancy(){
      this._resumeService.getResumeByCandidateId(this.currentUser.userId).subscribe({
        next: data => {
          if(data){
            
          }
        },
        error: (err: any) => {
          Swal.fire("Something went wrong...","Please create your resume first before applying for a vacancy", "error");
          this.router.navigate(['resume'])
          console.log(err.error.message);
        }
      })
    }

    deleteVacancy(){
      Swal.fire({
        title: 'Do you want to terminate this vacancy?\n Title: ' + this.vacancyForm!.name,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this._vacancyService.delete(this.vacancyForm!.vacancyId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['vacancy'])
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
