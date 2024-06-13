import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  message: string | undefined;
  qrCode: string | undefined;
  email: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    this.message = navigation.message;
    this.qrCode = navigation.qrCode;
    this.email = navigation.email;
    
  }

  check(otp: string) {
    this.apiService.verifyRegister(this.email, otp).subscribe(
      response => {
        if (response) {
            if (response) {
              this.router.navigate(['/login']);
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
}
