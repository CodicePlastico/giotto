import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Polygon } from '../app.model';

@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.scss']
})
export class PolygonsComponent {

  @Input() public polygons: Polygon[];
  @Input() public polygonsColors: string[];
  @Output() public remove: EventEmitter<number> = new EventEmitter();

  public getColor(i: number): string {
    if (this.polygonsColors && this.polygonsColors.length > 0) {
      const key = i % this.polygonsColors.length;
      return this.polygonsColors[key];
    } else {
      return '#000';
    }
  }

  public handleClick(i: number) {
    this.remove.emit(i);
  }

}
