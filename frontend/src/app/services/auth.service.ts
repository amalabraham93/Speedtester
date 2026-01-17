import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private socialAuthService: SocialAuthService
    ) {
        this.loadUser();
    }

    // ... (rest of methods)

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Force Google SignOut to prevent auto-login next time
            this.socialAuthService.signOut().catch(err => console.log('Social Signout Error', err));
        }
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    private loadUser() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                this.currentUserSubject.next(JSON.parse(user));
            }
        }
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    loginWithGoogle(idToken: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/google`, { token: idToken }).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    private setSession(authResult: any) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', authResult.token);
            localStorage.setItem('user', JSON.stringify(authResult.user));
        }
        this.currentUserSubject.next(authResult.user);
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
