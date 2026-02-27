import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getIpInfo(): Observable<any> {
        return this.http.get(`${this.apiUrl}/test/ip`).pipe(
            catchError(error => {
                console.warn('Backend IP proxy failed, trying direct browser-side fallbacks', error);
                return new Observable(observer => {
                    // Try ipwho.is first
                    fetch('https://ipwho.is/')
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                console.log('Frontend IP detection succeeded via ipwho.is');
                                observer.next({
                                    ip: data.ip,
                                    city: data.city,
                                    region: data.region,
                                    country_name: data.country,
                                    org: data.connection?.isp || data.connection?.org || 'Standard ISP',
                                    asn: data.connection?.asn
                                });
                                observer.complete();
                            } else {
                                throw new Error('ipwho info unsuccessful');
                            }
                        })
                        .catch(err => {
                            console.warn('Final fallback: ipify');
                            fetch('https://api.ipify.org?format=json')
                                .then(res => res.json())
                                .then(data => {
                                    observer.next({
                                        ip: data.ip,
                                        city: 'Network Edge',
                                        org: 'Detected Provider'
                                    });
                                    observer.complete();
                                })
                                .catch(errFinal => {
                                    console.error('All IP fallbacks failed', errFinal);
                                    observer.error(errFinal);
                                });
                        });
                });
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials);
    }

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

    getOutages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/outage`);
    }
}
