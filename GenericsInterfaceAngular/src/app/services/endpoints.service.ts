import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
  constructor(private http: HttpClient) { }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createUser(firstName: string, lastName: string, age: number, email: string, address: string, mobile: string, password: string, token: string): Observable<any> {
    const newUser = {
      nombre: firstName,
      apellidos: lastName,
      edad: age,
      correo: email,
      direccion: address,
      telefono: mobile,
      contrasena: password,
    };

    return this.http.post<any>(`${environment.apiUrl}api/v1/usuarios/crear`, newUser, { headers: this.getHeaders(token) });
  }

  getUser(searchBy: string, searchTerm: string, token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/v1/usuarios/${searchBy}/${searchTerm}`, { headers: this.getHeaders(token) });
  }

  editUser(emailIndex: string, updatedUser: any, token: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}api/v1/usuarios/editar/${emailIndex}`, updatedUser, { headers: this.getHeaders(token) });
  }

  deleteUser(email: string, token: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}api/v1/usuarios/borrar/${email}`, { headers: this.getHeaders(token) });
  }

  checkUser(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/v1/usuarios/pendientes`, { headers: this.getHeaders(token) });
  }

  proveUsers(email: string, token: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}api/v1/usuarios/aprobar/${email}?estado=true`, null, { headers: this.getHeaders(token) });
  }
}
