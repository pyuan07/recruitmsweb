
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Gender, ObjectState, Role } from 'src/app/_shared/enum/enum';
import Swal from 'sweetalert2';
import { User } from '../../models/user-model';
import * as $ from 'jquery';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userFrom: User;

  constructor(private _userService: UserService, private tokenService:TokenStorageService ,private router: Router) {  
    this.userFrom = this.tokenService.getUser()!;
  }
   

    ngOnInit(): void {
      
    }

    onSubmit(): void {
      this._userService.update(this.userFrom).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'User editd Successfully!'
          });
        },
        error: err => {
          if(err.error.message)
            Swal.fire("Error", err.error.message, "error");
          else
            Swal.fire("Error", err.message, "error");
        }
      });
    }
  }
