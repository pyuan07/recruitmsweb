import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Role } from 'src/app/_shared/enum/enum';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.css']
})
export class ResendComponent implements OnInit {
  
  resendEmail: string = '';

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.authService.resend(this.resendEmail).subscribe({
      next: data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Verification Email has been sent!',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Verification Email has been sent!',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/login']);
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
