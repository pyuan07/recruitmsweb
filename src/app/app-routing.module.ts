import { ResumeListComponent } from './resume/components/resume-list/resume-list.component';
import { VacancyDetailsComponent } from './vacancy/components/vacancy-details/vacancy-details.component';
import { VacancyEditComponent } from './vacancy/components/vacancy-edit/vacancy-edit.component';
import { VacancyCreateComponent } from './vacancy/components/vacancy-create/vacancy-create.component';
import { VacancyListComponent } from './vacancy/components/vacancy-list/vacancy-list.component';
import { UserEditComponent } from './user/components/user-edit/user-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserCreateComponent } from './user/components/user-create/user-create.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { ProfileComponent } from './user/components/profile/user-view.component';
import { UserDetailsComponent } from './user/components/user-details/user-details.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TestComponent } from './user/components/test/test.component';
import { OrganizationListComponent } from './organization/components/organization-list/organization-list.component';
import { OrganizationCreateComponent } from './organization/components/organization-create/organization-create.component';
import { OrganizationEditComponent } from './organization/components/organization-edit/organization-edit.component';
import { OrganizationDetailsComponent } from './organization/components/organization-details/organization-details.component';
import { ResumeCreateComponent } from './resume/components/resume-create/resume-create.component';
import { ResumeDetailsComponent } from './resume/components/resume-details/resume-details.component';
import { ResumeEditComponent } from './resume/components/resume-edit/resume-edit.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },

  //User Routing
  { path: 'user', component: UserListComponent },
  { path: 'user/create', component: UserCreateComponent },
  { path: 'user/edit/:id', component: UserEditComponent },
  { path: 'user/details/:id', component: UserDetailsComponent },

  //Organization Routing
  { path: 'organization', component: OrganizationListComponent },
  { path: 'organization/create', component: OrganizationCreateComponent },
  { path: 'organization/edit/:id', component: OrganizationEditComponent },
  { path: 'organization/details/:id', component: OrganizationDetailsComponent },

   //Vacancy Routing
   { path: 'vacancy', component: VacancyListComponent },
   { path: 'vacancy/create', component: VacancyCreateComponent },
   { path: 'vacancy/edit/:id', component: VacancyEditComponent },
   { path: 'vacancy/details/:id', component: VacancyDetailsComponent },

   //Resume Routing
   { path: 'resume', component: ResumeListComponent },
   { path: 'resume/create', component: ResumeCreateComponent },
   { path: 'resume/edit/:id', component: ResumeEditComponent },
   { path: 'resume/details/:id', component: ResumeDetailsComponent },
   


  { path: 'test', component: TestComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
