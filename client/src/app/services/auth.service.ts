import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(
    private _http: Http
  ) { }

  // Register request.
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.post('/users/register', user, {headers: headers}).map(res => res.json());
  }

  // Authentication request.
  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this._http.post('/users/authenticate', user, {headers: headers}).map(res => res.json());
  }

  // User profile request.
  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this._http.get('/users/profile', {headers: headers}).map(res => res.json());
  }

  // Store logged user token.
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // Load stored logged user token.
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // Check login token.
  loggedIn() {
    return tokenNotExpired('id_token');
  }

  // Logout and clear storage.
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
