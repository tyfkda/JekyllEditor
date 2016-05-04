import {Component} from '@angular/core'

import {EditComponent} from '../edit/edit.component'

@Component({
  template: '<edit-component></edit-component>',
  directives: [EditComponent],
})
export class NewPost {
  private posts: any

  constructor() {
  }
}
