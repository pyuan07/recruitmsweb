import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/user/models/user-model";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

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
    this._userService.getAll().subscribe(data => {
      this.userlist = data
    });
  }

  goToCreateUser(){
    this.router.navigate(['/user/create']);
  }
  
  deleteUser(id: string, username: string){
    Swal.fire({
      title: 'Do you want to terminate this user?\n username: ' + username,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._userService.delete(id).subscribe({
          next: data => {
            if(data){
              Swal.fire("Terminated Successfully", "", "success");
              window.location.reload();
            }
            else{
              Swal.fire("Failed to Terminate", "Something went wrong...", "error");
            }
          },
          error: (err: any) => {
            Swal.fire("Error", err.error.message, "error");
          }
        })
      }
    })
  }

}
