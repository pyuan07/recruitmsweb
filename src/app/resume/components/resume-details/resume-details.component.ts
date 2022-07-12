import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resume } from 'src/app/models/resume-model';
import { ResumeService } from 'src/app/services/resume.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resume-details',
  templateUrl: './resume-details.component.html',
  styleUrls: ['./resume-details.component.css']
})
export class ResumeDetailsComponent implements OnInit {

  resumeForm!: Resume;
  imageUrl: string = '';
  pdfUrl: string = '';

  constructor(private _resumeService: ResumeService, private route: ActivatedRoute, private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this.getResumeDetails(this.route.snapshot.params['id']);
    }

    private getResumeDetails(id: string){
      this._resumeService.getById(id).subscribe({
        next: data => {
          this.resumeForm = data;
          this.imageUrl = environment.apiEndpoint +'/v1/resume/download/image/'+ data.profilePicture;
          this.pdfUrl = environment.apiEndpoint +'/v1/resume/download/pdf/'+ data.resumePdf;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['resume/edit', this.resumeForm!.resumeId])
    }

    deleteResume(){
      Swal.fire({
        title: 'Do you want to delete this resume?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this._resumeService.delete(this.resumeForm!.resumeId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['resume'])
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
