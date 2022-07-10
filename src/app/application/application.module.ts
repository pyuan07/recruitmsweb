import { Application } from 'src/app/models/application-model';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
import { ApplicationShortlistedComponent } from './components/application-shortlisted/application-shortlisted.component';

@NgModule({
  declarations: [
    ApplicationDetailsComponent,
    ApplicationListComponent,
    ApplicationShortlistedComponent
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
export class ApplicationModule { }