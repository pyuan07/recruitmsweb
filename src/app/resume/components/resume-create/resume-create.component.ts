import { ObjectState } from './../../../_shared/enum/enum';
import { OrganizationService } from '../../../services/organization.service';
import { Organization } from '../../../models/organization-model';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country-model';
import { TagService } from '../../../services/tag.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, NgForm } from '@angular/forms';
import { ResumeService } from 'src/app/services/resume.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-resume-create',
  templateUrl: './resume-create.component.html',
  styleUrls: ['./resume-create.component.css']
})
export class ResumeCreateComponent implements OnInit {
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags!: Observable<string[]>;
  allTags!: string[];
  selectedTags: string[] = [];
  tagCtrl = new FormControl('');
  imageUrl?: string | ArrayBuffer | null;
  pdfFile?: File;

  candidateList!: User[];
  countryList!: Country[];
  allOrganization!: Organization[];

  currentUser!: User;
  isAdmin: boolean = false;
  isEmployer: boolean = false;
  isCandidate: boolean = false;

  picName: string = '';
  pdfName: string = '';


  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(  private _resumeService: ResumeService, 
                private _userService: UserService, 
                private _tagService: TagService, 
                private _countryService: CountryService,
                private _organizationService: OrganizationService,
                private tokenService:TokenStorageService, 
                private router: Router
              ) {  
    this.currentUser = this.tokenService.getUser()!;
    this.isAdmin = this.tokenService.isAdmin();
    this.isEmployer = this.tokenService.isEmployer();
    this.isCandidate = this.tokenService.isCandidate();
  }


  ngOnInit(): void {
    this.getActiveTags();
    this.getAllCountries();
    this.getAllOrganization();
    this.getAllCandidate();
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

  private getAllOrganization(){
    this._organizationService.getByObjState("ACTIVE").subscribe({
      next: data => {
        this.allOrganization = data;
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

  onSubmit(createForm: NgForm): void {
    if(this.picName == ''){
      Swal.fire("Error", "Please upload your profile picture before proceed", "error");
      return;
    }
    if(this.picName == ''){
      Swal.fire("Error", "Please upload your resume in PDF format before proceed", "error");
      return;
    }

    createForm.value.tags = this.selectedTags;
    createForm.value.profilePicture = this.picName;
    createForm.value.resumePdf = this.pdfName;

    if(this.isCandidate){
      createForm.value.owner = this.currentUser.userId;
      createForm.value.objectState = ObjectState.ACTIVE;
    }

    this._resumeService.create(createForm.value).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Resume Created Successfully!'
        });
        this.router.navigate(['resume']);
      },
      error: err => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
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
