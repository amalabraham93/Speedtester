import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
    providedIn: 'root'
})
export class ImageGenService {

    constructor() { }

    async generateResultImage(element: HTMLElement): Promise<string> {
        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Retina quality
                backgroundColor: '#0f172a', // Match slate-900
                logging: false,
                useCORS: true
            });
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating image', error);
            throw error;
        }
    }

    downloadImage(dataUrl: string, filename: string = 'speed-test-result.png') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
