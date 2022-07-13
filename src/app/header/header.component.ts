import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user-model';
import { Role } from '../_shared/enum/enum';
import { ApplicationService } from '../services/application.service';
import { ScheduleService } from '../services/schedule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private roles: Role = Role.NOT_AUTH;
  isLoggedIn = false;
  isAdmin = false;
  isCandidate = false;
  isEmployer = false;
  username?: string;
  currentUser!: User;


  constructor(private tokenStorageService: TokenStorageService, 
              // private _applicationService: ApplicationService,
              // private _scheduleService: ScheduleService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.currentUser = this.tokenStorageService.getUser()!;

    if (this.isLoggedIn) {
      this.getRoles();
    }
  }

  getRoles(){
    this.roles = this.currentUser.roles;

    this.isAdmin = this.roles == Role.ADMIN;
    this.isCandidate = this.roles == Role.CANDIDATE;
    this.isEmployer = this.roles == Role.EMPLOYER;

    this.username = this.currentUser.username;
  }

  // getBadges(){
  //   if(this.isCandidate){
  //     this._applicationService.getByObjState("ACTIVE").subscribe({
  //       next: data => {
  //         this.myApplicationCount = data.filter(x=>x.candidate.userId == this.currentUser.userId).length;
  //       },
  //       error: (err: any) => {
  //         Swal.fire("Error", err.error.message, "error");
  //       }
  //     });

  //     this._scheduleService.getByObjState("ACTIVE").subscribe({
  //       next: data => {
  //         this.myScheduleCount = data.filter(x=>x.application.candidate.userId == this.currentUser.userId).length;
  //       },
  //       error: (err: any) => {
  //         Swal.fire("Error", err.error.message, "error");
  //       }
  //     });
  //   }

  //   if(this.isEmployer){

  //   }
  // }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
