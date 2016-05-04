import {Component} from '@angular/core'
import {RouteParams} from '@angular/router-deprecated'

import {EditComponent} from './edit.component'

@Component({
  template: '<edit-component [originalFileName]="file"></edit-component>',
  directives: [EditComponent],
})
export class Edit {
  private file: string

  constructor(routeParams: RouteParams) {
    this.file = routeParams.get('post')
  }
}
