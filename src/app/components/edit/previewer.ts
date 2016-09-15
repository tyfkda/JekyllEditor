import {Component, Input} from '@angular/core'

@Component({
  selector: 'previewer',
  template: require('./previewer.html'),
})
export class Previewer {
  @Input() protected html: string
}
