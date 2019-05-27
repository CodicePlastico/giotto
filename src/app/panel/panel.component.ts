import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Point, Polygon, Measure } from '../app.model';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements AfterViewInit, OnChanges {

  @ViewChild('canvasEl') canvasEl: ElementRef;
  @ViewChild('canvasImg') canvasImg: ElementRef;
  @Input() public polygons: Polygon[];
  @Input() public measures: Measure[];
  @Input() public polygonsColors: string[];
  @Input() public measuresColors: string[];
  @Input() public file: File;
  @Output() public canvasClick: EventEmitter<Point> = new EventEmitter();

  public canvasWidth: number;
  public canvasHeight: number;

  private context: CanvasRenderingContext2D;
  private contextImg: CanvasRenderingContext2D;

  constructor() {
    this.canvasHeight = 600;
    this.canvasWidth = 800;
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvasEl.nativeElement;
    const canvasImg: HTMLCanvasElement = this.canvasImg.nativeElement;
    this.context = canvasEl.getContext('2d');
    this.contextImg = canvasImg.getContext('2d');
    this.context.lineWidth = 1;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.polygons) {
      if (!changes.polygons.firstChange) {
        this.redraw();
      }
    }
    if (changes.measures) {
      if (!changes.measures.firstChange) {
        this.redraw();
      }
    }
    if (changes.file) {
      if (!changes.file.firstChange) {
        this.drawFile();
      }
    }
  }

  private redraw() {
    this.clearAll();
    this.drawPolygons();
    this.drawMeasures();
  }

  private clearAll() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawPolygons() {
    this.polygons.forEach((polygon: Polygon, i: number) => {
      const color = this.getColor(this.polygonsColors, i);
      polygon.forEach((point: Point, j: number) => {
        this.drawPoint(point, color);
        if (j) {
          const prevPoint = polygon[j - 1];
          this.drawLine(prevPoint, point, color);
        }
      });
    });
  }

  private drawMeasures() {
    this.measures.forEach((measure: Measure, i: number) => {
      const color = this.getColor(this.measuresColors, i);
      this.drawPoint(measure.from, color);
      if (measure.to) {
        this.drawPoint(measure.to, color);
        this.drawLine(measure.from, measure.to, color, true);
      }
    });
  }

  private drawFile() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const left = Math.ceil(this.canvasWidth / 2) - Math.ceil(img.width / 2);
          const right = Math.ceil(this.canvasHeight / 2) - Math.ceil(img.height / 2);
          this.contextImg.drawImage(img, left, right);
        };
        const target: FileReader = event.target as FileReader;
        img.src = target.result as string;
      };
      reader.readAsDataURL(this.file);
    } else {
      this.contextImg.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
  }

  private drawLine(a: Point, b: Point, color: string, dashed: boolean = false) {
    const segments = dashed ? [5, 5] : [];
    this.context.beginPath();
    this.context.setLineDash(segments);
    this.context.moveTo(a.x, a.y);
    this.context.lineTo(b.x, b.y);
    this.context.strokeStyle = color;
    this.context.stroke();
  }

  private drawPoint(point: Point, color: string) {
    const {x, y} = point;
    this.context.fillStyle = color;
    this.context.fillRect(x - 2, y - 2, 4, 4);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
    .pipe(
      map((evt: MouseEvent): Point => {
        return {x: evt.layerX, y: evt.layerY};
      })
    )
    .subscribe((point: Point) => {
      this.canvasClick.emit(point);
    });
  }

  private getColor(colors: string[], i: number) {
    if (colors && colors.length > 0) {
      const key = i % colors.length;
      return colors[key];
    } else {
      return '#000';
    }
  }
}
