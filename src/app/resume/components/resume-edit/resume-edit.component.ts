import { UserService } from './../../../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Resume } from 'src/app/models/resume-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ResumeService } from 'src/app/services/resume.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Country } from 'src/app/models/country-model';
import { Organization } from 'src/app/models/organization-model';
import { CountryService } from 'src/app/services/country.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { TagService } from 'src/app/services/tag.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ResumeModifyRequest } from 'src/app/models/request/resume-modify-request';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user-model';

@Component({
  selector: 'app-resume-edit',
  templateUrl: './resume-edit.component.html',
  styleUrls: ['./resume-edit.component.css']
})
export class ResumeEditComponent implements OnInit {
  resumeForm!: Resume;
  resumeModifyRequest!: ResumeModifyRequest;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags!: Observable<string[]>;
  allTags!: string[];
  selectedTags: string[] = [];
  tagCtrl = new FormControl('');

  countryList!: Country[];
  candidateList!: User[];
  isAdmin: boolean = false;
  isCandidate: boolean = false;

  currentUser!: User;

  picName:string= '';
  pdfName: string = '';

  imageUrl?: string | ArrayBuffer;
  pdfUrl : string = '';

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(private _resumeService: ResumeService,
    private _tagService: TagService, 
    private _countryService: CountryService,
    private _userService: UserService, 
    private tokenService:TokenStorageService, 
    private route: ActivatedRoute ,
    private router: Router) {  
    
  }
   
  ngOnInit(): void {
    this.isAdmin = this.tokenService.isAdmin();
    this.isCandidate  = this.tokenService.isCandidate();
    this.currentUser = this.tokenService.getUser()!;
    this.getResumeDetails(this.route.snapshot.params['id']);
    this.getAllCountries();
    this.getActiveTags();
    this.getAllCandidate();
  }

  private getResumeDetails(id: string){
    this._resumeService.getById(id).subscribe({
      next: data => {
        this.resumeForm = data;
        this.picName = data.profilePicture;
        this.pdfName = data.resumePdf;
        this.imageUrl = environment.apiEndpoint +'/v1/resume/download/image/'+ data.profilePicture;
        this.pdfUrl = environment.apiEndpoint +'/v1/resume/download/pdf/'+ data.resumePdf;

        this.selectedTags = data.tags.map(function(tag){
          return tag.name;
        });
      },
      error: (err: any) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
  }

    onSubmit(): void {
      //Mapping

      if(this.picName == ''){
        Swal.fire("Error", "Please upload your profile picture before proceed", "error");
        return;
      }
      if(this.pdfName == ''){
        Swal.fire("Error", "Please upload your resume in PDF format before proceed", "error");
        return;
      }

      this.resumeModifyRequest = this.resumeForm;
      this.resumeModifyRequest.tagString = this.selectedTags;

      this.resumeModifyRequest.profilePicture = this.picName;
      this.resumeModifyRequest.resumePdf = this.pdfName;

      console.log(this.resumeModifyRequest);
      //this.resumeForm.value.tags = this.selectedTags;
      this._resumeService.update(this.resumeModifyRequest).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'Resume edited Successfully!'
          });
          window.history.go(-1);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }


    private getAllCountries(){
      this._countryService.getAll().subscribe({
        next: data => {
          this.countryList = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  
    private getAllCandidate(){
      this._userService.getByRole("CANDIDATE").subscribe({
        next: data => {
          this.candidateList = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  
    private getActiveTags(){
      this. _tagService.getByObjState("ACTIVE").subscribe({
        next: data => {
          this.allTags = data.map(function(tag){
              return tag.name;
          });
          this.startFilterAndAutoComplete();
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  
    private startFilterAndAutoComplete(){
      this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => (tag ? this._filter(tag) : [])),
      );
    }
    
    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
  
      // Add Tag
      if (value && !this.selectedTags.includes(value)) {
        this.selectedTags.push(value);
      }
  
      // Clear the input value
      event.chipInput!.clear();
  
      this.tagCtrl.setValue(null);
    }
  
    remove(tag: string): void {
      const index = this.selectedTags.indexOf(tag);
  
      if (index >= 0) {
        this.selectedTags.splice(index, 1);
      }
    }
  
    selected(event: MatAutocompleteSelectedEvent): void {
      this.selectedTags.push(event.option.viewValue);
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue) && !this.selectedTags.includes(tag));
    }

    
  onUploadProfilePicture(event: any){
    const file = event.target.files[0];
    if (file == null)
        return;
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
        this.imageUrl = reader.result!; 
    }

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', file, file.name);
    this._resumeService.uploadProfilePic(uploadImageData).subscribe({
      next: data => {
        this.picName = data.filename;
      },
      error: (err: any) => {
        Swal.fire("Error", err.message, "error");
      }
    });
  }

  onUploadPdf(event: any) {
    const file = event.target.files[0];
    if (file == null)
        return;

    const uploadResumeData = new FormData();
    uploadResumeData.append('file', file, file.name);
    this._resumeService.uploadResume(uploadResumeData).subscribe({
      next: data => {
        this.pdfName = data.filename;
      },
      error: (err: any) => {
        Swal.fire("Error", err.message, "error");
      }
    });
  }

  }
