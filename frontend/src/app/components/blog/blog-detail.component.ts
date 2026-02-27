import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { SeoService } from '../../services/seo.service';
import { FooterComponent } from '../footer/footer.component';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-blog-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FooterComponent],
    template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans">
      <nav class="p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center bg-slate-950/80">
        <a routerLink="/" class="flex items-center gap-2 group">
          <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span class="font-bold tracking-widest text-xl">SPEEDTRACK</span>
        </a>
        <a routerLink="/blog" class="text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors">← Back to Archive</a>
      </nav>

      <main *ngIf="blog" class="max-w-4xl mx-auto px-6 py-16">
        <header class="mb-12">
          <div class="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
             <span>{{ blog.category }}</span>
             <span class="text-slate-700">|</span>
             <span>{{ blog.readingTime }} Min Read</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-black mb-8 leading-tight">
            {{ blog.title }}
          </h1>
          
          <div class="flex items-center gap-4 border-y border-white/5 py-6">
            <div class="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-cyan-400">AA</div>
            <div>
              <div class="text-sm font-bold">{{ blog.author }}</div>
              <div class="text-xs text-slate-500">Network Strategy Lead • {{ blog.createdAt | date:'longDate' }}</div>
            </div>
          </div>
        </header>

        <figure class="mb-12 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
          <img [src]="blog.image" [alt]="blog.title" class="w-full h-auto object-cover max-h-[500px]">
        </figure>

        <article class="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed text-lg" [innerHTML]="blog.content">
        </article>
        
        <footer class="mt-20 pt-12 border-t border-white/5">
          <div class="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[2.5rem] border border-white/10 text-center">
            <h3 class="text-2xl font-bold mb-4 italic">Enjoyed this analysis?</h3>
            <p class="text-slate-400 text-sm mb-8">Join thousands of network enthusiasts who use SpeedTrack to monitor their digital life.</p>
            <a routerLink="/" class="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 hover:scale-105 transition-all">Start Speed Test</a>
          </div>
        </footer>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    :host { display: block; }
    ::ng-deep .prose p { margin-bottom: 2rem; }
    ::ng-deep .prose h2 { color: white; margin-top: 3rem; margin-bottom: 1.5rem; font-weight: 800; font-size: 1.875rem; }
    ::ng-deep .prose strong { color: #22d3ee; }
  `]
})
export class BlogDetailComponent implements OnInit {
    blog: Blog | null = null;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        private seoService: SeoService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.blogService.getBlogBySlug(params['slug']).subscribe(blog => {
                this.blog = blog;
                this.updateSeo(blog);
                this.injectSchema(blog);
            });
        });
    }

    updateSeo(blog: Blog) {
        this.seoService.updateSeoData({
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.excerpt,
            ogImage: blog.image,
            ogType: 'article'
        });
    }

    injectSchema(blog: Blog) {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': blog.title,
            'image': [blog.image],
            'datePublished': blog.createdAt,
            'dateModified': blog.createdAt,
            'author': [{
                '@type': 'Person',
                'name': blog.author,
                'url': 'https://speedtrack.com/about'
            }]
        };

        if (isPlatformServer(this.platformId)) {
            // Inject script tag for SSR
            const script = this.renderer.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schema);
            this.renderer.appendChild(this.document.head, script);
        }
    }
}
