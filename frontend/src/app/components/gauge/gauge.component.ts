import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex flex-col items-center justify-center p-4">
      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-neon-blue opacity-5 blur-3xl rounded-full"></div>

      <svg class="w-72 h-44 overflow-visible" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#2f80ed;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Background Arc (Semi-circle) -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" stroke="#1e293b" stroke-width="12" stroke-linecap="round" />

        <!-- Progress Arc -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="url(#grad1)" 
              stroke-width="12" 
              stroke-linecap="round"
              filter="url(#glow)"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="offset"
              class="transition-all duration-300 ease-out" />

        <!-- Ticks -->
        <line x1="100" y1="20" x2="100" y2="28" stroke="#334155" stroke-width="2" />
        <text x="100" y="38" text-anchor="middle" fill="#64748b" font-size="8">50</text>

        <line x1="25" y1="100" x2="33" y2="100" stroke="#334155" stroke-width="2" />
        <text x="38" y="98" text-anchor="middle" fill="#64748b" font-size="8">5</text>

        <line x1="175" y1="100" x2="167" y2="100" stroke="#334155" stroke-width="2" />
        <text x="162" y="98" text-anchor="middle" fill="#64748b" font-size="8">200</text>

        <!-- Speed Text (Center) -->
        <text x="100" y="85" text-anchor="middle" fill="white" font-size="36" font-weight="bold" filter="url(#glow)">
          {{ value | number:'1.0-0' }}
        </text>
        <text x="100" y="100" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="medium">
          {{ unit }}
        </text>
      </svg>
    </div>
  `
})
export class GaugeComponent implements OnChanges {
  @Input() value: number = 0;
  @Input() max: number = 100;
  @Input() label: string = 'Speed';
  @Input() unit: string = 'Mbps';
  @Input() color: string = '#2f80ed';

  circumference: number = 251.2; // Pi * 80 (radius) = ~251
  offset: number = 251.2;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['max']) {
      const progress = Math.min(this.value / this.max, 1);
      // Arc is 180 degrees, so we only fill half circle? 
      // The path A 80 80 0 0 1 180 100 describes a semi-circle. 
      // Length of semi-circle is Pi * r = 3.14 * 80 = 251.2
      this.offset = this.circumference - (this.circumference * progress);
    }
  }
}
