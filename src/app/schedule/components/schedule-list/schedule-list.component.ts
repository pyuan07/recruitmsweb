import { ApplicationStatus, ObjectState } from 'src/app/_shared/enum/enum';
import {OnInit , Component, ViewChild, Input} from '@angular/core';
import { Router } from "@angular/router";
import { Schedule } from "src/app/models/schedule-model";
import { ScheduleService } from "src/app/services/schedule.service";
import Swal from "sweetalert2";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user-model';
import { ScheduleTimeslotService } from 'src/app/services/scheduleTimeslot.service';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { U } from '@angular/cdk/keycodes';
import { ApplicationService } from 'src/app/services/application.service';


@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})

export class ScheduleListComponent implements OnInit {

  displayedColumns: string[] = ['vacancy', 'organization', 'candidate','timeslot', 'approach', 'meetingUrl','actions'];
  dataSource!: MatTableDataSource<Schedule>;
  
  isCandidate: boolean = false;
  isEmployer: boolean = false;
  isAdmin: boolean = false;
  currentUser!: User;

  currentSchedule!: Schedule;
  updatedMeetingUrl: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _scheduleService: ScheduleService, 
              private _applicationService: ApplicationService,
              private _tokenStorageService: TokenStorageService,
              private router: Router) {  
    this.isCandidate = this._tokenStorageService.isCandidate();
    this.isEmployer = this._tokenStorageService.isEmployer();
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.currentUser = this._tokenStorageService.getUser()!;
  }

  ngOnInit(): void {
    this.getAllSchedule();
    if(this.isCandidate){
      this.displayedColumns = ['vacancy', 'organization', 'timeslot', 'approach', 'meetingUrl','actions'];
    }
    if(this.isEmployer){
      this.displayedColumns = ['vacancy', 'candidate', 'timeslot', 'approach', 'meetingUrl','actions'];
    }
  }

  private getAllSchedule(){
    this._scheduleService.getByObjState("ACTIVE").subscribe({
      next: data => {
        if(this.isAdmin)
        {
          this.dataSource = new MatTableDataSource(data);
        }
        else if(this.isEmployer)
        {
          this.dataSource = new MatTableDataSource(data.filter(data => data.scheduleTimeslot.vacancy.organization.owner.userId == this.currentUser.userId));
        }
        else if(this.isCandidate)
        {
          this.dataSource = new MatTableDataSource(data.filter(data => data.application.candidate.userId == this.currentUser.userId));
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

  trackCurrentSchedule(id:number){
    this._scheduleService.getById(id).subscribe({
      next: data => {
        this.currentSchedule = data;
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

  attachMeetingUrl(){
    this.currentSchedule.meetingUrl = this.updatedMeetingUrl;
    this._scheduleService.update(this.currentSchedule).subscribe({
      next: data => {
        Swal.fire("Attach Meeting URL Successfully", "", "success");
        this.getAllSchedule();
        this.updatedMeetingUrl = '';
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }

  completeMeeting(id: number, offer: boolean){
    Swal.fire({
      title: 'Do you want to complete this meeting,\n as well as the application?',
      text: "The related application will also be updated to \"COMPLETED\" status after you complete the meeting schedule.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._scheduleService.getById(id).subscribe({
          next: schedule => {

            this._scheduleService.delete(id).subscribe({
              next: data => {
                if(data){
                  let application = schedule.application;
                  if(offer){
                    application.status = ApplicationStatus.COMPLETED;
                  }
                  else{
                    application.status = ApplicationStatus.DECLINED;
                  }

                  this._applicationService.update(application).subscribe({
                    next: data => {
                      Swal.fire("Completed", "You have completed an application.", "success");
                    },
                    error: (err: any) => {
                      Swal.fire("Error when update the application", err.error.message, "error");
                    }
                  });
                }
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
}
