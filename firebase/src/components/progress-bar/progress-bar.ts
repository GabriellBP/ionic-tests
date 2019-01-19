import {Component, Input} from '@angular/core';


@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress;

  text: string;

  constructor() {
    console.log('Hello ProgressBarComponent Component');
    this.text = 'Hello World';
  }

}
