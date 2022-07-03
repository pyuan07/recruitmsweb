import { TokenStorageService } from 'src/app/services/token-storage.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userFrom!: User;
  isAdmin: boolean = false;

  constructor(private _userService: UserService, private _tokenStorageService: TokenStorageService,private route: ActivatedRoute ,private router: Router) {  
    this.isAdmin = this._tokenStorageService.isAdmin();
  }
   
    ngOnInit(): void {
      this.getUserDetails(this.route.snapshot.params['id']);
    }

    getUserDetails(id:string){
      this._userService.getById(id).subscribe({
        next: data => {
          this.userFrom = data;
          this.userFrom.dob = new Date(data.dob);
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['user/edit', this.userFrom!.userId])
    }

    deleteUser(){
      Swal.fire({
        title: 'Do you want to terminate this user?\n username: ' + this.userFrom!.username,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._userService.delete(this.userFrom!.userId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['user'])
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
