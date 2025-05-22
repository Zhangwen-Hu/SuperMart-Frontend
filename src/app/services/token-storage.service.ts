import { Injectable } from '@angular/core';
import { ERole } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
  private adminStatus = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');

  constructor() { 
    // Initialize state on service creation
    if (this.hasToken()) {
      const user = this.getUser();
      this.adminStatus.next(this.checkIfAdmin());
      this.usernameSubject.next(user.username || '');
    }
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private checkIfAdmin(): boolean {
    const user = this.getUser();
    
    if (user && user.roles) {
      if (Array.isArray(user.roles)) {
        // Handle string array (old format)
        if (typeof user.roles[0] === 'string') {
          return user.roles.includes('ROLE_ADMIN');
        }
        // Handle Role array (new format)
        else if (typeof user.roles[0] === 'object') {
          return user.roles.some((role: any) => 
            role.name === ERole.ROLE_ADMIN
          );
        }
      }
    }
    return false;
  }

  // Observable streams
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInStatus.asObservable();
  }

  get isAdmin$(): Observable<boolean> {
    return this.adminStatus.asObservable();
  }

  get username$(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  signOut(): void {
    window.localStorage.clear();
    this.loggedInStatus.next(false);
    this.adminStatus.next(false);
    this.usernameSubject.next('');
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
    this.loggedInStatus.next(true);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.adminStatus.next(this.checkIfAdmin());
    this.usernameSubject.next(user.username || '');
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  
  public isAdmin(): boolean {
    return this.checkIfAdmin();
  }
} 