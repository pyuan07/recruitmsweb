import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { Vacancy } from 'src/app/models/vacancy-model';
import { ApplicationService } from 'src/app/services/application.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';
import { Application } from 'src/app/models/application-model';
declare var google:any;

@Component({
  selector: 'app-overview-vacancy',
  templateUrl: './overview-vacancy.component.html',
  styleUrls: ['./overview-vacancy.component.css']
})
export class OverviewVacancyComponent implements OnInit {

  vacancyList?: Vacancy[];
  currentVacancy?: Vacancy;
  vacancyDesc: string ='';
  vacancyOpening: number = 0;
  appliedQty: number = 0;

  isAdmin: boolean = false;
  isCandidate: boolean = false;
  currentUser!: User;

  hiredCandidate!: Application[];
  rejectedCandidate!: Application[];
  progressCandidate!: Application[];

  constructor(  private _vacancyService: VacancyService, 
                private _applicationsService: ApplicationService,
                private _tokenStorageService: TokenStorageService,
                private route: ActivatedRoute,
                private router: Router) {  
    this.currentUser = this._tokenStorageService.getUser()!;
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
  }
   
  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    this.getActiveVacancy();
  }

  getApplicationDetails(id: number) {
    this._applicationsService.getByObjState("ACTIVE").subscribe({
      next: data => {

        data.forEach((data) => {
          data.matchedTag = data.resume.tags.filter(resumeTag => data.vacancy.tags.some(tag => tag.name == resumeTag.name)).length;
        });

        data = data.filter(x=>x.vacancy.vacancyId == id);
        this.hiredCandidate = data.filter(x=>x.status.toString() == "COMPLETED");
        this.rejectedCandidate = data.filter(x=>x.status.toString() == "DECLINED");
        this.progressCandidate = data.filter(x=>x.status.toString() == "APPLIED" || x.status.toString() == "VIEWED" || x.status.toString() == "SHORTLISTED");
        this.drawApplicationOverviewChart();
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
    
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
        this.getApplicationDetails(data.vacancyId);
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

  drawApplicationOverviewChart() {
    var func = (chart: any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Status');
      data.addColumn('number', 'Candidate Qty');

      data.addRows([
        ['Hired', this.hiredCandidate.length],
        ['Declined ', this.rejectedCandidate.length],
        ['In Progress', this.progressCandidate.length],
        ['Remaining slot', this.vacancyOpening - this.hiredCandidate.length - this.progressCandidate.length]
      ]);
      var options = {
        title: 'Application Overview',
        colors: ["green", "red", "yellow", "grey"]
      };
      chart().draw(data, options);
    }
    var chart =()=> new google.visualization.PieChart(document.getElementById('divApplicationPieChart'));
    var callback=()=>func(chart);
    google.charts.setOnLoadCallback(callback);
  }
}
