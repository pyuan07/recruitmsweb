import { Component } from '@angular/core';
import { User } from './models/user-model';
import { TokenStorageService } from './services/token-storage.service';
import { Role } from './_shared/enum/enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  private roles: Role = Role.NOT_AUTH;
  isLoggedIn = false;
  isAdmin = false;
  isCandidate = false;
  isEmployer = false;
  username?: string;
  currentUser!: User;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.currentUser = this.tokenStorageService.getUser()!;

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser()!;
      this.roles = user.roles;

      this.isAdmin = this.roles == Role.ADMIN;
      this.isCandidate = this.roles == Role.CANDIDATE;
      this.isEmployer = this.roles == Role.EMPLOYER;

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
