import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user-model';
import { Role } from '../_shared/enum/enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private roles: Role = Role.NOT_AUTH;
  isLoggedIn = false;
  isAdmin = false;
  isCandidate = false;
  isEmployer = false;
  username?: string;
  currentUser!: User;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

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
