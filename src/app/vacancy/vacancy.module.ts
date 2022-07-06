import { TestComponent } from './../user/components/test/test.component';
import { VacancyCreateComponent } from './components/vacancy-create/vacancy-create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VacancyListComponent } from './components/vacancy-list/vacancy-list.component';
import { RouterModule } from '@angular/router';
import { VacancyDetailsComponent } from './components/vacancy-details/vacancy-details.component';
import { VacancyEditComponent } from './components/vacancy-edit/vacancy-edit.component';

// Angular/Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VacancyFindComponent } from './components/vacancy-find/vacancy-find.component';

@NgModule({
  declarations: [
    VacancyListComponent,
    VacancyCreateComponent,
    VacancyEditComponent,
    VacancyDetailsComponent,
    VacancyFindComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    // Angular/Material
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,

  ]
})
export class VacancyModule { }