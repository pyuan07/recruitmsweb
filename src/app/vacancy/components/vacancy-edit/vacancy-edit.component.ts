import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Vacancy } from 'src/app/models/vacancy-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
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
import { VacancyModifyRequest } from 'src/app/models/request/vacancy-modify-request';
import { ExtractTagsRequest } from 'src/app/models/request/extract-tags-request';

@Component({
  selector: 'app-vacancy-edit',
  templateUrl: './vacancy-edit.component.html',
  styleUrls: ['./vacancy-edit.component.css']
})
export class VacancyEditComponent implements OnInit {
  vacancyForm!: Vacancy;
  vacancyModifyRequest!: VacancyModifyRequest;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags!: Observable<string[]>;
  allTags!: string[];
  selectedTags: string[] = [];
  tagCtrl = new FormControl('');

  countryList!: Country[];
  allOrganization!: Organization[];

  isAdmin: boolean = false;

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(private _vacancyService: VacancyService,
    private _tagService: TagService, 
    private _countryService: CountryService,
    private _organizationService: OrganizationService, 
    private tokenService:TokenStorageService, 
    private route: ActivatedRoute ,
    private router: Router) {  
    this.isAdmin = this.tokenService.isAdmin();
  }
   
  ngOnInit(): void {
    this.getVacancyDetails(this.route.snapshot.params['id']);
    this.getAllCountries();
    this.getActiveTags();
    this.getAllOrganization();
  }

  private getVacancyDetails(id: number){
    this._vacancyService.getById(id).subscribe({
      next: data => {
        this.vacancyForm = data;
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
      this.vacancyModifyRequest = this.vacancyForm;
      this.vacancyModifyRequest.tagString = this.selectedTags;

      //this.vacancyForm.value.tags = this.selectedTags;
      this._vacancyService.update(this.vacancyModifyRequest).subscribe({
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

    extractDescriptionTag(desc: string){
      let request: ExtractTagsRequest = {
        raw: desc
      };
      this._tagService.extractTags(request).subscribe({
        next: data => {
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Extract Successfully!'
          });
          data.forEach(tag => {
            if (tag && !this.selectedTags.includes(tag.name)) {
              this.selectedTags.push(tag.name);
            }
          });
  
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
