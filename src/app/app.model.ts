export interface Point {
  x: number;
  y: number;
}

export interface Measure {
  from: Point;
  to: Point;
}

export type Polygon = Point[];

export type ButtonAction = 'polygon' | 'measure' | 'erase';

export interface Button {
  label: string;
  action: ButtonAction;
}
