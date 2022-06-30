
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Vacancy } from 'src/app/models/vacancy-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';

@Component({
  selector: 'app-vacancy-edit',
  templateUrl: './vacancy-edit.component.html',
  styleUrls: ['./vacancy-edit.component.css']
})
export class VacancyEditComponent implements OnInit {
  vacancyFrom!: Vacancy;
  today = new Date(); 

  constructor(private _vacancyService: VacancyService, private tokenService:TokenStorageService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this._vacancyService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => {
          this.vacancyFrom = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    onSubmit(): void {
      this._vacancyService.update(this.vacancyFrom!).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'Vacancy edited Successfully!'
          });
          window.history.go(-1);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
