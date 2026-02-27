import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, Blog } from '../../services/blog.service';
import { SeoService } from '../../services/seo.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-blog-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FooterComponent],
    template: `
    <div class="min-h-screen bg-slate-950 text-white font-sans bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <nav class="p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <a routerLink="/" class="flex items-center gap-2 group">
          <svg class="w-6 h-6 text-neon-cyan group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span class="font-bold tracking-widest text-xl">SPEEDTRACK</span>
        </a>
      </nav>

      <main class="max-w-6xl mx-auto px-6 py-20">
        <header class="mb-20 text-center">
          <h1 class="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Network Intelligence Blog
          </h1>
          <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Expert insights into internet performance, global network infrastructure, and optimization strategies for the modern web.
          </p>
        </header>

        <div *ngIf="blogs.length > 0; else noBlogs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <article *ngFor="let blog of blogs" class="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-cyan-500/30 transition-all group flex flex-col">
            <div class="h-56 bg-slate-800 relative overflow-hidden">
               <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
               <img [src]="blog.image" [alt]="blog.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60">
               <div class="absolute bottom-6 left-6 z-20">
                  <span class="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {{ blog.category }}
                  </span>
               </div>
            </div>
            
            <div class="p-8 flex-1 flex flex-col">
              <h2 class="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">{{ blog.title }}</h2>
              <p class="text-slate-400 text-sm mb-8 line-clamp-3">
                {{ blog.excerpt }}
              </p>
              
              <div class="mt-auto flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[10px] font-bold">AA</div>
                  <div>
                    <div class="text-[10px] font-bold text-white uppercase">{{ blog.author }}</div>
                    <div class="text-[9px] text-slate-500">{{ blog.createdAt | date:'longDate' }}</div>
                  </div>
                </div>
                <div class="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">
                  {{ blog.readingTime }} Min Read
                </div>
              </div>
            </div>
            
            <a [routerLink]="['/blog', blog.slug]" class="absolute inset-0 z-30" [attr.aria-label]="blog.title"></a>
          </article>
        </div>

        <ng-template #noBlogs>
          <div class="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <p class="text-slate-500 italic">Initializing content archive... Check back soon for expert insights.</p>
          </div>
        </ng-template>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class BlogListComponent implements OnInit {
    blogs: Blog[] = [];

    constructor(
        private blogService: BlogService,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.seoService.updateSeoData({
            title: 'Expert Network Blog - Performance Tips & Insights',
            description: 'The SpeedTrack Blog: Your source for internet optimization tips, ISP analysis, and the latest in global connectivity technology.',
            keywords: 'network blog, internet tips, wifi optimization, speed test insights, tech blog'
        });

        this.blogService.getBlogs().subscribe(blogs => {
            this.blogs = blogs;
        });
    }
}
