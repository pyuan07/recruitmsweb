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

  constructor() { }

}
