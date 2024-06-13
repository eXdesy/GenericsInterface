import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import * as qrcode from 'qrcode';

@Component({  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor(private apiService: ApiService, private router: Router) { }

  onLogin(email: string, password: string, otp: string) {
    this.apiService.authLogin(email, password).subscribe(
      response => {
        if (response) {
          localStorage.setItem('token', response.token);

          if (response.mfaEnabled) {

            this.verificy(email, otp);
            
          } else if (!response.mfaEnabled) {
            this.router.navigate(['/home']);
          }
        } else {
          this.router.navigate(['/check'], { state: { message: 'loginError' } });
        }
      },
      error => {
        if (error && error.response && error.response.status === 500) {
          console.log('Error interno del servidor: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'serverError' } });
        } else if (error && error.response && error.response.status === 400) {
          console.log('Error interno del cliente: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'clientError' } });
        } else {
          console.log('Error inesperado: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'error' } });
        }
      }
    );
  }
  
  verificy(email: string, otp: string) {
    this.apiService.verify(email, otp).subscribe(
      response => {
        if (response) {
            if (response) {
              this.router.navigate(['/home']);
            } else {
              alert("OTP incorrecto, intenta de nuevo")
            }
        } else {
          this.router.navigate(['/check'], { state: { message: 'loginError' } });
        }
      },
      error => {
        if (error && error.response && error.response.status === 500) {
          console.log('Error interno del servidor: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'serverError' } });
        } else if (error && error.response && error.response.status === 400) {
          console.log('Error interno del cliente: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'clientError' } });
        } else {
          console.log('Error inesperado: ' + error.message);
          this.router.navigate(['/check'], { state: { message: 'error' } });
        }
      }
    );
  }

  onRegister(firstName: string, lastName: string, email: string, password: string, checkAuth: boolean) {
    this.apiService.authRegister(firstName, lastName, email, password, checkAuth).subscribe(
      response => {
        if(response) {
          if (checkAuth && response.secret) {
            const otpAuthUrl = this.generateOTPAuthUrl('GENERICS', `${email}`, response.secret);
            qrcode.toDataURL(otpAuthUrl, (err, qrCodeUrl) => {
              if (err) {
                this.router.navigate(['/check'], { state: { message: 'fa2Error' } });
              } else {
                this.router.navigate(['/check'], { state: { message: 'fa2Register', qrCode: qrCodeUrl, email: email} });
              }
            });
          } else {
            this.router.navigate(['/check'], { state: { message: 'register' } });
          }
        }
      },
      error => {
        if (error.response) {
          if (error.response.status === 500) {
            console.log('Error interno del servidor: '+error.message);
            this.router.navigate(['/check'], { state: { message: 'serverError' } });  
          } else if (error.response.status === 400) {
            console.log('Error interno del cliente: '+error.message);
            this.router.navigate(['/check'], { state: { message: 'clientError' } });  
          }
        } else {
          console.log('Error inesperado: '+error.message);
          this.router.navigate(['/check'], { state: { message: 'error' } });  
        }
      }
    );
  }

  generateOTPAuthUrl(issuer: string, email: string, secret: string): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedEmail = encodeURIComponent(email);
    const encodedSecret = encodeURIComponent(secret);
    return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${encodedSecret}&issuer=${encodedIssuer}`;
  }

  containerActive = false;
  activeForm: 'login' | 'register' = 'login';
  togglePanel(active: boolean) {
    this.containerActive = active;
    this.activeForm = active ? 'register' : 'login';
  }
}
