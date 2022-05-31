
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user-model';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser : User | null = null;

  constructor(private token: TokenStorageService) { 
    
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser()!;
  }
}
