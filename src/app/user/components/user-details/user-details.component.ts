import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user-model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userFrom: User | undefined;

  constructor(private _userService: UserService, private route: ActivatedRoute ,private router: Router) {  
    
  }
   
    ngOnInit(): void {
      this._userService.getById(this.route.snapshot.params['id']).subscribe({
        next: data => this.userFrom = data,
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['user/edit', this.userFrom!.id])
    }

    deleteUser(){
      Swal.fire({
        title: 'Do you want to terminate this user?\n username: ' + this.userFrom!.username,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._userService.delete(this.userFrom!.id).subscribe({
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
