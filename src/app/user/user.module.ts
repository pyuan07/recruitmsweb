import { UserCreateComponent } from './components/user-create/user-create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class UserModule { }