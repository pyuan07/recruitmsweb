
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userFrom!: User;
  today = new Date(); 

  constructor(private _userService: UserService, private tokenService:TokenStorageService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this._userService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => {
          this.userFrom = data;
          this.userFrom.dob = new Date(data.dob);
        },
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
