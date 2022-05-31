
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userFrom: User | undefined;

  constructor(private _userService: UserService, private tokenService:TokenStorageService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this._userService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => this.userFrom = data,
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    onSubmit(): void {
      this._userService.update(this.userFrom!).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'User edited Successfully!'
          });
          window.history.go(-1);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
