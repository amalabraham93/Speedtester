import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    image: string;
    category: string;
    tags: string[];
    readingTime: number;
    createdAt: string;
    metaTitle?: string;
    metaDescription?: string;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private apiUrl = `${environment.apiUrl}/blog`;

    constructor(private http: HttpClient) { }

    getBlogs(): Observable<Blog[]> {
        return this.http.get<Blog[]>(this.apiUrl);
    }

    getBlogBySlug(slug: string): Observable<Blog> {
        return this.http.get<Blog>(`${this.apiUrl}/${slug}`);
    }
}
