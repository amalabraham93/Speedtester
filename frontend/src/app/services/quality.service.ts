import { Injectable } from '@angular/core';

export interface QualityScore {
    score: number; // 0-5
    label: string;
    class: string; // 'good', 'fair', 'bad'
}

@Injectable({
    providedIn: 'root'
})
export class QualityService {

    constructor() { }

    calculateScores(download: number, upload: number, ping: number, jitter: number) {
        return {
            browsing: this.getBrowsingScore(download, ping),
            gaming: this.getGamingScore(ping, jitter),
            streaming: this.getStreamingScore(download),
            videoCall: this.getVideoCallScore(upload, ping, jitter)
        };
    }

    private getBrowsingScore(dl: number, ping: number): QualityScore {
        // Browsing needs decent DL (>5) and OK ping (<150)
        let score = 5;
        if (dl < 2) score -= 3;
        else if (dl < 10) score -= 1;

        if (ping > 300) score -= 2;
        else if (ping > 150) score -= 1;

        return this.finalizeScore(score);
    }

    private getGamingScore(ping: number, jitter: number): QualityScore {
        // Critical: Ping (<40 great, >100 bad), Jitter (<10 great)
        let score = 5;
        if (ping > 150) score -= 4;
        else if (ping > 100) score -= 3;
        else if (ping > 60) score -= 2;
        else if (ping > 40) score -= 1;

        if (jitter > 30) score -= 1;

        return this.finalizeScore(score);
    }

    private getStreamingScore(dl: number): QualityScore {
        // 4K needs ~25Mbps, HD ~5Mbps
        if (dl > 25) return this.finalizeScore(5); // 4K Ready
        if (dl > 15) return this.finalizeScore(4); // 1080p+
        if (dl > 5) return this.finalizeScore(3);  // 1080p
        if (dl > 2) return this.finalizeScore(2);  // 720p
        return this.finalizeScore(1);              // 480p/Buffer
    }

    private getVideoCallScore(ul: number, ping: number, jitter: number): QualityScore {
        // Needs stable Upload (>2Mbps) and low latency
        let score = 5;
        if (ul < 0.5) score -= 4;
        else if (ul < 2) score -= 2;
        else if (ul < 5) score -= 1;

        if (ping > 150) score -= 1;
        if (jitter > 50) score -= 1;

        return this.finalizeScore(score);
    }

    private finalizeScore(raw: number): QualityScore {
        const score = Math.max(1, Math.min(5, raw));
        let label = 'Great';
        let cls = 'text-neon-green';

        if (score <= 2) {
            label = 'Poor';
            cls = 'text-neon-red';
        } else if (score <= 3) {
            label = 'Fair';
            cls = 'text-yellow-400';
        } else if (score <= 4) {
            label = 'Good';
            cls = 'text-neon-blue';
        } else {
            label = 'Excellent';
            cls = 'text-neon-green';
        }

        return { score, label, class: cls };
    }
}
