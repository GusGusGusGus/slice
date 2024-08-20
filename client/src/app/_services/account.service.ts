import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  roleMatch(roles: string[]) {
    throw new Error('Method not implemented.');
  }

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }

  login(model: any, options?: {headers?: any}): Observable<any> {
    return this.http.post<User>(this.baseUrl + "account/login", model, options)
    .pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    ) ;
  }

  register(model: any) {
      return this.http.post(this.baseUrl + 'account/register', model);
  }

  resendConfirmationEmail(email: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account/resendconfirmationemail', {email});
  }

  confirmEmail(userId: string, code: string): Observable<any> {
    return this.http.get(this.baseUrl + 'account/confirmemail', {
      params: { userId, code }
    });
  }

  sendResetPasswordLink(email: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account/sendresetpasswordemail', {email});
  }

  resetPassword(model: any): Observable<any> {
    return this.http.post(this.baseUrl + 'account/resetpassword', model);
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

}
