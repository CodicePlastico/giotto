import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonAction, Button } from '../app.model';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent {

  @Input() public currentAction: ButtonAction;
  @Input() public buttons: Button[];
  @Output() public changeAction: EventEmitter<ButtonAction> = new EventEmitter();

  public handleClick(button: Button) {
    this.changeAction.emit(button.action);
  }

}
