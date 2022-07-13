import { Vacancy } from './../../models/vacancy-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { ApplicationService } from 'src/app/services/application.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';
import { Application } from 'src/app/models/application-model';
import * as _ from 'lodash';
declare var google:any;

@Component({
  selector: 'app-vacancy-report',
  templateUrl: './vacancy-report.component.html',
  styleUrls: ['./vacancy-report.component.css']
})
export class VacancyReportComponent implements OnInit {

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
    this.drawVacancyOverviewChart();
  }

  drawVacancyOverviewChart() {
    var func = (chart: any) => {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Country');
      data.addColumn('number', 'Vacancy Qty');

      this._vacancyService.getByObjState("ACTIVE").subscribe({
        next: vacancy => {

          const grouped = _.groupBy(vacancy, v => v.country.name);

          _.forEach(grouped, function(groupedVacancy, country){
            data.addRows([
              [ country , groupedVacancy.length]
            ]);
          });
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
      var options = {
        title: 'Vacancy Country Overview'
      };
      chart().draw(data, options);
    }
    var chart =()=> new google.visualization.PieChart(document.getElementById('divVacancyPieChart'));
    var callback=()=>func(chart);
    google.charts.setOnLoadCallback(callback);
  }
}
