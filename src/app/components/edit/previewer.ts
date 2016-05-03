import {Component, Input} from '@angular/core'

@Component({
  selector: 'previewer',
  templateUrl: 'app/components/edit/previewer.html',
  directives: [],
})
export class Previewer {
  @Input() html: string
}
