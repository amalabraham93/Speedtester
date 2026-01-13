import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl; // e.g., http://localhost:5000/api

    constructor(private http: HttpClient) { }

    // Utils
    getIpInfo(): Observable<any> {
        return this.http.get('https://ipapi.co/json/');
    }

    // Auth
    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials);
    }

    // Tests
    saveTestResult(result: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/test/save`, result, { headers });
    }

    getHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/test/history`);
    }

    getUserHistory(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/test/user/${userId}`);
    }

    // Outages
    getOutages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/outage`);
    }
}
