import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getCurrentUser(): Observable<User> {
    // Optionally decode JWT for user ID, or call /users/me if available
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data, { headers: this.getAuthHeaders() });
  }
}
