import { ObjectState } from 'src/app/_shared/enum/enum';
import { ScheduleTimeslotService } from './../../../services/scheduleTimeslot.service';
import { ScheduleTimeslot } from './../../../models/scheduleTimeslot-model';
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

@Component({
  selector: 'app-schedule-available',
  templateUrl: './schedule-available.component.html',
  styleUrls: ['./schedule-available.component.css']
})
export class ScheduleAvailableComponent implements OnInit {

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
  candidateResume?: Resume;
  applicationRemarks: string  = '';
  availableTimeslot!: ScheduleTimeslot[];

  application!: Application;

  constructor(  private _vacancyService: VacancyService, 
                private _scheduleTimeslotService: ScheduleTimeslotService,
                private _applicationsService: ApplicationService,
                private _tokenStorageService: TokenStorageService,
                private route: ActivatedRoute,
                private router: Router) {  
    this.currentUser = this._tokenStorageService.getUser()!;
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
  }
   
    ngOnInit(): void {
      this.getActiveVacancy();
    }

    private getActiveVacancy(){
      this._vacancyService.getByObjState("ACTIVE").subscribe({
        next: data => {
          this.vacancyList = data.filter(x=>x.organization.owner.userId == this.currentUser.userId);
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    onChangeVacancy(event: any){
      this._vacancyService.getById(event.target.value).subscribe({
        next: data => {
          this.currentVacancy = data;
          this.vacancyOpening = data.numberOfOpening;
          this.vacancyDesc = data.description;
          this._applicationsService.getByVacancyId(data.vacancyId).subscribe({
            next: application => {
              this.appliedQty = application.length;
            }
          });
          this.getScheduleTimeslotByVacancyId(data.vacancyId);
          
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    private getScheduleTimeslotByVacancyId(id:number){
      this._scheduleTimeslotService.getByVacancyId(id).subscribe({
        next: timeslot => {
          this.availableTimeslot = timeslot;
        }
      });
    }

    onCreate(createForm: NgForm): void {
      if(this.currentVacancy == null || this.currentUser == undefined){
        Swal.fire({
          icon: 'error',
          title: 'Please select a vacancy before creating the timeslot!'
        });
        return;
      }
      createForm.value.vacancy = this.currentVacancy;
      createForm.value.availableDateTime = moment(createForm.value.availableDateTime).toDate();
      createForm.value.objectState = ObjectState.ACTIVE;
      this._scheduleTimeslotService.create(createForm.value).subscribe({
        next: data => {
          Swal.fire({
            icon: 'success',
            title: 'Timeslot Created Successfully!'
          });
          this.getScheduleTimeslotByVacancyId(this.currentVacancy!.vacancyId)
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    deleteTimeslot(id: number,){
      Swal.fire({
        title: 'Do you want to delete this timeslot?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._scheduleTimeslotService.delete(id).subscribe({
            next: data => {
              if(data){
                Swal.fire("Delete Successfully", "", "success");
                this.getScheduleTimeslotByVacancyId(this.currentVacancy!.vacancyId)
              }
              else{
                Swal.fire("Failed to Delete", "Something went wrong...", "error");
              }
            },
            error: (err: any) => {
              Swal.fire("Error", err.error.message, "error");
            }
          });
        }
      });
    }
}
