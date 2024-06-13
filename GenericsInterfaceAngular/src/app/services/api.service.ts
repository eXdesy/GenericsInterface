import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jwtSecret = 'lMCvj7Sirkk41OpuXDBKoSA1YeQ4aTeHmP4gzoyoaLk=';

  constructor(private http: HttpClient) { }

  authLogin(email: string, password: string): Observable<any> {
    const user = {
      correo: email,
      contrasena: password
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtSecret
    });

    return this.http.post<any>(`${environment.apiUrl}auth/login`, user, { headers });
  }

  authRegister(firstName: string, lastName: string, email: string, password: string, checkAuth: boolean) {
    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      correo: email,
      contrasena: password,
      mfaEnabled: checkAuth
    };

    return this.http.post<any>(`${environment.apiUrl}auth/register`, newUser);
  }

  verify(email: string, code: string): Observable<any> {
    const otp = {
      email: email,
      code: code
    };

    return this.http.post<any>(`${environment.apiUrl}auth/verify`, otp);
  }

  verifyRegister(email: string, code: string): Observable<any> {
    const otp = {
      email: email,
      code: code
    };

    return this.http.post<any>(`${environment.apiUrl}auth/verifyRegister`, otp);
  }
}
