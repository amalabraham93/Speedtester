import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl; // e.g., http://localhost:5000/api

    constructor(private http: HttpClient) { }

    // Utils
    getIpInfo(): Observable<any> {
        // Use our backend proxy to avoid CORS
        return this.http.get(`${this.apiUrl}/test/ip`).pipe(
            catchError(error => {
                console.warn('Backend IP proxy failed, trying direct fallback', error);
                // Fallback and map to expected structure
                return new Observable(observer => {
                    fetch('https://ipwho.is/')
                        .then(res => res.json())
                        .then(data => {
                            observer.next({
                                ip: data.ip,
                                city: data.city,
                                region: data.region,
                                country_name: data.country,
                                org: data.connection?.isp || 'Unknown ISP',
                                asn: data.connection?.asn
                            });
                            observer.complete();
                        })
                        .catch(err => observer.error(err));
                });
            })
        );
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
        return this.http.post(`${this.apiUrl}/test/save`, result);
    }

    getHistory(ip?: string): Observable<any[]> {
        let url = `${this.apiUrl}/test/history`;
        if (ip) {
            url += `?ip=${ip}`;
        }
        return this.http.get<any[]>(url);
    }

    getUserHistory(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/test/user/${userId}`);
    }

    // Outages
    getOutages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/outage`);
    }
}
