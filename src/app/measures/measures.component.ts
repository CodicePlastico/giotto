import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Measure } from '../app.model';

@Component({
  selector: 'app-measures',
  templateUrl: './measures.component.html',
  styleUrls: ['./measures.component.scss']
})
export class MeasuresComponent {

  @Input() public measures: Measure[];
  @Input() public measuresColors: string[];
  @Output() public remove: EventEmitter<number> = new EventEmitter();

  public printMeasure(measure: Measure) {
    const from = measure.from ? ` (${measure.from.x}, ${measure.from.y})` : '';
    const to = measure.to ? ` (${measure.to.x}, ${measure.to.y})` : '';
    const length = measure.from && measure.to ? this.calculateLength(measure.from, measure.to) : '';
    return `${length}${from}${to}`;
  }

  public getColor(i: number): string {
    if (this.measuresColors && this.measuresColors.length > 0) {
      const key = i % this.measuresColors.length;
      return this.measuresColors[key];
    } else {
      return '#000';
    }
  }

  private calculateLength(a, b): string {
    const opposite = a.x - b.x;
    const adjacent = a.y - b.y;
    const hypotenuse =  Math.round(Math.sqrt( opposite * opposite + adjacent * adjacent));
    return `${hypotenuse}:`;
  }

  public handleClick(i: number) {
    this.remove.emit(i);
  }
}
