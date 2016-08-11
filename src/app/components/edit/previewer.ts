import {Component, Input} from '@angular/core'

@Component({
  selector: 'previewer',
  template: require('./previewer.html'),
  directives: [],
})
export class Previewer {
  @Input() protected html: string
}
