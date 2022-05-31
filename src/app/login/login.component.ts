import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/request/login-request';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Role } from '../_shared/enum/enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: Role = Role.NOT_AUTH;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser()!.roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.loginRequest;

    this.authService.login(this.loginRequest).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.authenticationToken);
        this.tokenStorage.saveUser(data.logonUser);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser()!.roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
