import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  constructor(private _userService: UserService, private router: Router) {  

  }

    ngOnInit(): void {

    }

    onSubmit(createForm: NgForm): void {
      this._userService.create(createForm.value).subscribe({
        next: data => {
          console.log(data);
          
          Swal.fire({
            icon: 'success',
            title: 'User Created Successfully!'
          });
          this.router.navigate(['user']);
        },
        error: err => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }
  }
