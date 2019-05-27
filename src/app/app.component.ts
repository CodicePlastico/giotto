import { Component, ViewChild, ElementRef } from '@angular/core';
import { Button, ButtonAction, Measure, Polygon, Point } from './app.model';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public measures: Measure[] = [];
  public polygons: Polygon[] = [[]];
  public file: File;

  @ViewChild('myInput') myInputVariable: ElementRef;

  public measuresColors: string[] = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
  ];
  public polygonsColors: string[] = [
    '#008080', '#e6beff', '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000'
  ];

  public currentAction: ButtonAction = 'polygon';
  public buttons: Button[] = [
    {
      label: 'Disegna',
      action: 'polygon'
    },
    {
      label: 'Misura',
      action: 'measure'
    }
  ];

  public handleChange(action: ButtonAction) {
    this.currentAction = action;
  }

  public handleClick(point: Point) {
    switch (this.currentAction) {
      case 'polygon':
        const polygons = this.polygons.slice();
        const lastPolygon = polygons.pop();
        const firstPoint = lastPolygon ? lastPolygon[0] : null;
        if (firstPoint && this.nearPoint(firstPoint, point)) {
          lastPolygon.push(firstPoint);
          this.polygons = [...polygons, lastPolygon, []];
        } else {
          lastPolygon.push(point);
          this.polygons = [...polygons, lastPolygon];
        }
        break;
      case 'measure':
        const measures = this.measures.slice();
        const lastMeasure = measures.pop();
        if (!lastMeasure) {
          this.measures = [...measures, {from: point, to: null}];
        } else if (lastMeasure.to) {
          this.measures = [...measures, lastMeasure, {from: point, to: null}];
        } else {
          const newMeasure = Object.assign({}, lastMeasure, {to: point});
          this.measures = [...measures, newMeasure];
        }
        break;
      default:
        console.log(this.currentAction, point);
    }
  }

  public clearAll() {
    this.measures = [];
    this.polygons = [[]];
    this.file = null;
  }

  public removePolygon(i: number) {
    let polygons = this.polygons.slice();
    polygons.splice(i, 1);
    if (polygons.length === 0) {
      polygons = [[]];
    }
    this.polygons = polygons.slice();
  }

  public removeMeasure(i: number) {
    const measures = this.measures.slice();
    measures.splice(i, 1);
    this.measures = measures.slice();
  }

  public updateFile(file) {
    if (file && file[0]) {
      this.file = file[0];
      this.myInputVariable.nativeElement.value = '';
    }
  }

  private nearPoint(a: Point, b: Point) {
    const tollerance = 2;
    const horizzontalDiff = Math.abs(a.x - b.x);
    const verticalDiff = Math.abs(a.y - b.y);
    return (verticalDiff <= tollerance && horizzontalDiff <= tollerance);
  }
}
