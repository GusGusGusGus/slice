import { Component } from '@angular/core';


interface TimelineEvent {
  id: number;
  title: string;
  date: string;
}


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {

  events: TimelineEvent[] = [
    { id: 1, title: 'Property Listed', date: '2023-01-01' },
    { id: 2, title: 'First Viewing', date: '2023-01-15' },
    { id: 3, title: 'Offer Received', date: '2023-02-01' },
    { id: 4, title: 'Offer Accepted', date: '2023-02-15' },
    { id: 5, title: 'Home Inspection', date: '2023-03-01' },
    { id: 6, title: 'Closing', date: '2023-04-01' },
  ];

  private width = 800;
  private height = 600;
  private padding = 50;

  ngOnInit(): void {}

  generateTimelinePath(): string {
    const steps = this.events.length - 1;
    const stepX = (this.width - 2 * this.padding) / steps;
    const midY = this.height / 2;
    const amplitude = this.height / 4;

    let path = `M ${this.padding} ${midY}`;

    for (let i = 1; i <= steps; i++) {
      const x = this.padding + i * stepX;
      const y = midY + Math.sin((i / steps) * Math.PI) * amplitude;
      path += ` Q ${x - stepX / 2} ${y} ${x} ${y}`;
    }

    return path;
  }

  getX(index: number): number {
    const steps = this.events.length - 1;
    const stepX = (this.width - 2 * this.padding) / steps;
    return this.padding + index * stepX;
  }

  getY(index: number): number {
    const midY = this.height / 2;
    const amplitude = this.height / 4;
    return (
      midY + Math.sin((index / (this.events.length - 1)) * Math.PI) * amplitude
    );
  }

}
