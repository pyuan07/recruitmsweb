import { Component } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { Role } from './_shared/enum/enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: Role = Role.NOT_AUTH;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser()!;
      this.roles = user.roles;

      this.showAdminBoard = Object.values(this.roles).includes('ADMIN');
      this.showModeratorBoard = Object.values(this.roles).includes('STAFF');

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
