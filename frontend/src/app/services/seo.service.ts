import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    updateMeta(config: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        keywords?: string;
    }) {
        // defaults
        const title = config.title ? `${config.title} | SpeedTrack` : 'SpeedTrack - Ultimate Internet Speed Test';
        const description = config.description || 'Test your internet speed with SpeedTrack. Deep analysis of ping, jitter, download, and upload speeds with futuristic visualization.';
        const image = config.image || 'https://speedtester-six.vercel.app/assets/og-image.jpg'; // Needs to be absolute
        const url = config.url || 'https://speedtester-six.vercel.app/';
        const keywords = config.keywords || 'speed test, internet speed, bandwidth test, ping, jitter, network analysis';

        // Update Title
        this.title.setTitle(title);

        // Update Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ name: 'keywords', content: keywords });
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });

        // Open Graph
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:site_name', content: 'SpeedTrack' });

        // Twitter Card
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });

        // JSON-LD (Only for SSR essentially, but good to have)
        // We would inject this into head if we had direct document access, 
        // but typical Angular Meta service interaction is enough for basic crawlers.
    }
}
