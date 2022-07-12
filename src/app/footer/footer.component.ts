import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user-model';
import { Role } from '../_shared/enum/enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {

  }

}
