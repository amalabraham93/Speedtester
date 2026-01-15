import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-background',
    standalone: true,
    imports: [CommonModule],
    template: `
    <canvas #canvas class="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"></canvas>
  `,
    styles: [`
    :host {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `]
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private animationId: number = 0;
    private mouse = { x: 0, y: 0 };
    private isBrowser: boolean;

    // Config
    private particleCount = 60;
    private connectionDistance = 150;
    private mouseDistance = 200;

    constructor(
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            this.initCanvas();
            this.createParticles();
            this.animate();
            window.addEventListener('mousemove', this.onMouseMove);
        }
    }

    ngOnDestroy(): void {
        if (this.isBrowser) {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            window.removeEventListener('mousemove', this.onMouseMove);
        }
    }

    @HostListener('window:resize')
    onResize() {
        if (this.isBrowser) {
            this.initCanvas();
            this.createParticles();
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    private initCanvas() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d')!;

        // Adjust particle count for screen size
        this.particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    }

    private createParticles() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = (Math.random() - 0.5) * 0.5; // Slow movement
            const vy = (Math.random() - 0.5) * 0.5;
            const color = Math.random() > 0.5 ? '#00E0FF' : '#0072FF'; // Cyan or Blue
            this.particles.push(new Particle(x, y, vx, vy, size, color));
        }
    }

    private animate() {
        this.ngZone.runOutsideAngular(() => {
            const loop = () => {
                if (!this.canvasRef) return;
                this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

                // Update and draw particles
                for (let i = 0; i < this.particles.length; i++) {
                    this.particles[i].update(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
                    this.particles[i].draw(this.ctx);

                    // Connections
                    this.connectParticles(i);
                    this.connectToMouse(i);
                }

                this.animationId = requestAnimationFrame(loop);
            };
            loop();
        });
    }

    private connectParticles(index: number) {
        for (let j = index + 1; j < this.particles.length; j++) {
            const dx = this.particles[index].x - this.particles[j].x;
            const dy = this.particles[index].y - this.particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.connectionDistance) {
                const opacity = 1 - (distance / this.connectionDistance);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(0, 224, 255, ${opacity * 0.15})`; // Very faint lines
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(this.particles[index].x, this.particles[index].y);
                this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                this.ctx.stroke();
            }
        }
    }

    private connectToMouse(index: number) {
        const dx = this.particles[index].x - this.mouse.x;
        const dy = this.particles[index].y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouseDistance) {
            const opacity = 1 - (distance / this.mouseDistance);
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(47, 128, 237, ${opacity * 0.3})`; // Brighter near mouse
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.particles[index].x, this.particles[index].y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
        }
    }
}

class Particle {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number,
        public size: number,
        public color: string
    ) { }

    update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
