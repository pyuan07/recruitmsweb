import { OrganizationService } from './../../../services/organization.service';
import { Organization } from './../../../models/organization-model';
import { CountryService } from './../../../services/country.service';
import { Country } from './../../../models/country-model';
import { TagService } from './../../../services/tag.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, NgForm } from '@angular/forms';
import { VacancyService } from 'src/app/services/vacancy.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-vacancy-create',
  templateUrl: './vacancy-create.component.html',
  styleUrls: ['./vacancy-create.component.css']
})
export class VacancyCreateComponent implements OnInit {
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags!: Observable<string[]>;
  allTags!: string[];
  selectedTags: string[] = [];
  tagCtrl = new FormControl('');

  countryList!: Country[];
  allOrganization!: Organization[];

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(  private _vacancyService: VacancyService, 
                private _tagService: TagService, 
                private _countryService: CountryService,
                private _organizationService: OrganizationService,
                private router: Router
              ) {  
    
  }

  ngOnInit(): void {
    this.getActiveTags();
    this.getAllCountries();
    this.getAllOrganization();
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
    this._vacancyService.create(createForm.value).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Vacancy Created Successfully!'
        });
        this.router.navigate(['vacancy']);
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
}
