import { SignupRequest } from './../models/request/singup-request';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: SignupRequest = {
    username: '',
    email: '',
    password: ''
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.register(this.form).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Verification Email has been sent!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: err => {
        Swal.fire("Error", err.message, "error");
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
