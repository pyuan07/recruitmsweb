import { ObjectState } from 'src/app/_shared/enum/enum';
import { ScheduleTimeslotService } from '../../../services/scheduleTimeslot.service';
import { ScheduleTimeslot } from '../../../models/scheduleTimeslot-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { Vacancy } from 'src/app/models/vacancy-model';
import { ApplicationService } from 'src/app/services/application.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';
import { Resume } from 'src/app/models/resume-model';
import { Application } from 'src/app/models/application-model';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';
import { scheduled } from 'rxjs';
import { Schedule } from 'src/app/models/schedule-model';

@Component({
  selector: 'app-schedule-book',
  templateUrl: './schedule-book.component.html',
  styleUrls: ['./schedule-book.component.css']
})
export class ScheduleBookComponent implements OnInit {

  vacancyList?: Vacancy[];
  currentVacancy?: Vacancy;
  vacancyDesc: string ='';
  vacancyOpening: number = 0;
  appliedQty: number = 0;
  today = new Date(); 

  isAdmin: boolean = false;
  isCandidate: boolean = false;
  applied: boolean = false;

  currentUser!: User;
  isMyVancacy: boolean = false;
  availableTimeslot!: ScheduleTimeslot[];

  applicationId: number = this.route.snapshot.params['id'];

  application!: Application;

  constructor(  private _vacancyService: VacancyService, 
                private _scheduleService: ScheduleService,
                private _scheduleTimeslotService: ScheduleTimeslotService,
                private _applicationService: ApplicationService,
                private _tokenStorageService: TokenStorageService,
                private route: ActivatedRoute,
                private router: Router) {  
    this.currentUser = this._tokenStorageService.getUser()!;
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
  }
   

    ngOnInit(): void {
      this._applicationService.getById(this.applicationId).subscribe({
        next: application =>{
          this.currentVacancy = application.vacancy;
          this.getScheduleTimeslotByVacancyId(application.vacancy.vacancyId);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      })
      
    }

    private getScheduleTimeslotByVacancyId(id:number){
      this._scheduleTimeslotService.getByVacancyId(id).subscribe({
        next: timeslot => {
          this.availableTimeslot = timeslot;
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    bookTimeslot(id: number){
      this._scheduleService.getByApplicationId(this.applicationId).subscribe({
        next: data => {
            Swal.fire("Error", "You already booked an interview on " + moment(data.scheduleTimeslot.availableDateTime).toDate() , "error");
        },
        error: err => {
          Swal.fire({
            title: 'Do you want to book this timeslot for interview?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              this._applicationService.getById(this.applicationId).subscribe({
                next: application => {

                  this._scheduleTimeslotService.getById(id).subscribe({
                    next: timeslot => {
                      timeslot.bookedBy = application.candidate;

                      this._scheduleTimeslotService.update(timeslot).subscribe({
                        next: timeslot => {
                          let schedule: Schedule = {
                            application: application,
                            scheduleTimeslot: timeslot,
                            objectState: ObjectState.ACTIVE
                          };
    
                          this._scheduleService.create(schedule).subscribe({
                            next: schedule => {
                              if(schedule){
                                Swal.fire("Booked Successfully", "", "success");
                                this.getScheduleTimeslotByVacancyId(this.currentVacancy!.vacancyId);
                              }
                              else{
                                Swal.fire("Failed to Book", "Something went wrong...", "error");
                              }
                            },
                            error: (err: any) => {
                              Swal.fire("Error", err.error.message, "error");
                            }
                          });
                        }
                      });
                    },
                    error: (err: any) => {
                      Swal.fire("Error", err.error.message, "error");
                    }
                  });
                },
                error: (err: any) => {
                  Swal.fire("Error", err.error.message, "error");
                }
              });
            }  
          });
        }
      });

    }
}
