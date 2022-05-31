import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/user/models/user-model";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

  public userlist: User[] | undefined;

  constructor(private _userService: UserService, private router: Router) {  
    
  }

  ngOnInit(): void {
    this._userService.getActive().subscribe(data => {
      this.userlist = data
    });
  }

  goToCreateUser(){
    this.router.navigate(['/user/create']);
  }

}
