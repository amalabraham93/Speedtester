import { Injectable, Inject, PLATFORM_ID, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface SeoData {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    robots?: string;
    canonical?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private renderer;

    constructor(
        private title: Title,
        private meta: Meta,
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, {
            id: 'seo-renderer',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });
    }

    updateSeoData(data: SeoData) {
        const siteName = 'SpeedTrack';
        const fullTitle = data.title ? `${data.title} | ${siteName}` : siteName;

        // Title
        this.title.setTitle(fullTitle);

        // Standard Meta Tags
        if (data.description) {
            this.meta.updateTag({ name: 'description', content: data.description });
        }
        if (data.keywords) {
            this.meta.updateTag({ name: 'keywords', content: data.keywords });
        }
        if (data.robots) {
            this.meta.updateTag({ name: 'robots', content: data.robots });
        }

        // Open Graph / Facebook
        this.meta.updateTag({ property: 'og:site_name', content: siteName });
        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        if (data.description) {
            this.meta.updateTag({ property: 'og:description', content: data.description });
        }
        this.meta.updateTag({ property: 'og:type', content: data.ogType || 'website' });
        this.meta.updateTag({ property: 'og:image', content: data.ogImage || `${environment.baseUrl}/assets/og-image.png` });

        // Twitter
        this.meta.updateTag({ name: 'twitter:card', content: data.twitterCard || 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
        if (data.description) {
            this.meta.updateTag({ name: 'twitter:description', content: data.description });
        }
        this.meta.updateTag({ name: 'twitter:image', content: data.ogImage || `${environment.baseUrl}/assets/og-image.png` });

        // Canonical
        this.updateCanonicalUrl(data.canonical);
    }

    private updateCanonicalUrl(url?: string) {
        // Remove existing canonical tag
        const existingCanonical = this.document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            this.renderer.removeChild(this.document.head, existingCanonical);
        }

        // Use current URL if none provided
        const canonicalUrl = url || (isPlatformBrowser(this.platformId)
            ? window.location.href.split('?')[0]
            : `${environment.baseUrl}`);

        const link: HTMLLinkElement = this.renderer.createElement('link');
        this.renderer.setAttribute(link, 'rel', 'canonical');
        this.renderer.setAttribute(link, 'href', canonicalUrl);
        this.renderer.appendChild(this.document.head, link);
    }
}
