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


  { path: 'test', component: TestComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
