
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacancy } from 'src/app/models/vacancy-model';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.css']
})
export class VacancyDetailsComponent implements OnInit {

  vacancyForm!: Vacancy;

  constructor(private _vacancyService: VacancyService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this.getVacancyDetails(this.route.snapshot.params['id']);
    }

    private getVacancyDetails(id: number){
      this._vacancyService.getById(id).subscribe({
        next: data => {
          this.vacancyForm = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['vacancy/edit', this.vacancyForm!.vacancyId])
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
