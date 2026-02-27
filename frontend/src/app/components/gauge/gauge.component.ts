import { Component, Input, OnChanges, SimpleChanges, NgZone, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex flex-col items-center justify-center">
      <!-- Glow Container -->
      <div class="absolute inset-0 bg-neon-cyan/10 blur-[80px] rounded-full transform scale-90 animate-pulse-slow pointer-events-none"></div>

      <!-- SVG Gauge -->
      <svg class="w-96 h-56 overflow-visible relative z-10" viewBox="0 0 200 120">
        <defs>
          <!-- Cyber Gradient -->
          <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00E0FF" style="stop-opacity:1" /> <!-- Neon Cyan -->
            <stop offset="50%" stop-color="#0078FF" style="stop-opacity:1" /> <!-- Deep Blue -->
            <stop offset="100%" stop-color="#00FFC6" style="stop-opacity:1" /> <!-- Cyber Teal -->
          </linearGradient>

          <!-- Glow Filter -->
          <filter id="cyberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Base Track (Dark Tapered) -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="#0f172a" 
              stroke-width="12" 
              stroke-linecap="round" />
        
        <!-- Ticks (Cyber Style) -->
        <g *ngFor="let tick of ticks">
            <line [attr.x1]="tick.x1" [attr.y1]="tick.y1" [attr.x2]="tick.x2" [attr.y2]="tick.y2" 
                  [attr.stroke]="tick.active ? '#00FFC6' : '#1e293b'" 
                  stroke-width="2" 
                  [attr.stroke-opacity]="tick.active ? 1 : 0.5" />
        </g>

        <!-- Dynamic Progress Arc (Sweep) -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="url(#cyberGradient)" 
              stroke-width="12" 
              stroke-linecap="round"
              filter="url(#cyberGlow)"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="currentOffset" />
        
        <!-- Sweep Tip/Head Flare -->
        <circle [attr.cx]="headX" [attr.cy]="headY" r="5" fill="#fff" filter="url(#cyberGlow)" class="transition-opacity duration-300" [style.opacity]="value > 0 ? 1 : 0" />

      </svg>
      
      <!-- Central Digital Readout -->
      <div class="absolute bottom-0 text-center z-20 transform translate-y-4">
         <div class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1 animate-pulse">{{ label }}</div>
         <div class="text-7xl font-display font-black text-white drop-shadow-[0_0_20px_rgba(0,224,255,0.4)] leading-none tabular-nums tracking-tighter">
            {{ displayValue | number:'1.0-0' }}
         </div>
         <div class="text-sm font-bold text-neon-teal mt-2 tracking-widest opacity-80" [class.animate-pulse]="value > 0">{{ unit }}</div>
      </div>
    </div>
  `
})
export class GaugeComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() value: number = 0;
  @Input() max: number = 100;
  @Input() label: string = 'SPEED';
  @Input() unit: string = 'Mbps';

  circumference: number = 251.2;
  currentOffset: number = 251.2;
  displayValue: number = 0;

  // Sweep Tip Coordinates
  headX: number = 20;
  headY: number = 100;

  ticks: any[] = [];

  private targetValue: number = 0;
  private targetOffset: number = 251.2;
  private animationId: number = 0;
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.generateTicks();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.animate();
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['max']) {
      this.targetValue = this.value;
      const progress = Math.min(this.value / this.max, 1);
      this.targetOffset = this.circumference - (this.circumference * progress);
    }
  }

  private animate() {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        // Elastic / Smooth easing
        const diffVal = this.targetValue - this.displayValue;
        if (Math.abs(diffVal) > 0.1) {
          this.displayValue += diffVal * 0.12; // Adjusted speed
        } else {
          this.displayValue = this.targetValue;
        }

        const diffOffset = this.targetOffset - this.currentOffset;
        if (Math.abs(diffOffset) > 0.1) {
          this.currentOffset += diffOffset * 0.12;
        } else {
          this.currentOffset = this.targetOffset;
        }

        // Calculate Head Position
        const totalLen = 251.2;
        const currentLen = totalLen - this.currentOffset;
        // Total angle span is 180 degrees (PI). 
        // Start is M 20 100 (180 deg). End is 180 100 (0 deg).
        // Actually wait, SVG arc A 80 80 starts at 20,100 which is 180 degrees.
        // It moves CLOCKWISE to 180,100 which is 0 degrees.
        // So angle starts at PI and goes to 0.

        const progressRatio = Math.max(0, Math.min(1, currentLen / totalLen));
        const currentAngle = Math.PI * (1 - progressRatio); // PI -> 0

        // Center 100,100. Radius 80.
        this.headX = 100 + 80 * Math.cos(-currentAngle); // SVG Y is down, need negative for upper half?
        // Wait, standard circle: 0 is right, PI is left.
        // -PI is left (20,100). 0 is right (180,100).
        // Arc goes from 180 to 0 (counter-clockwise visually? No, standard is clockwise).
        // Path A 80 80 0 0 1 ... 1 flag means large arc? No.

        // Simpler: Just map progress to angle
        // Angle goes from 180 (Left) to 360/0 (Right).
        const startAngle = Math.PI; // 180 deg
        const endAngle = 0;
        const renderAngle = startAngle - (progressRatio * Math.PI);

        // Parametric eq for circle center (100,100) radius 80
        // x = cx + r * cos(a)
        // y = cy - r * sin(a)  (Minus because SVG Y is down)

        this.headX = 100 + 80 * Math.cos(renderAngle); // cos(PI) = -1 -> 20. cos(0) = 1 -> 180. Correct.
        this.headY = 100 - 80 * Math.sin(renderAngle);

        // Update active ticks
        const currentValRatio = this.displayValue / this.max;
        this.ticks.forEach((tick, i) => {
          const tickRatio = i / (this.ticks.length - 1);
          tick.active = tickRatio <= currentValRatio;
        });

        this.ngZone.run(() => {
          // Update View
        });

        this.animationId = requestAnimationFrame(loop);
      };
      loop();
    });
  }

  private generateTicks() {
    const radius = 95; // Slightly outside track
    const center = { x: 100, y: 100 };
    const totalTicks = 30;

    for (let i = 0; i <= totalTicks; i++) {
      // 180 to 360 (0)
      const angleDeg = 180 + (i * (180 / totalTicks));
      const angleRad = (angleDeg * Math.PI) / 180;

      const x1 = center.x + Math.cos(angleRad) * (radius - 2);
      const y1 = center.y + Math.sin(angleRad) * (radius - 2);
      const x2 = center.x + Math.cos(angleRad) * radius;
      const y2 = center.y + Math.sin(angleRad) * radius;

      this.ticks.push({ x1, y1, x2, y2, active: false });
    }
  }
}
