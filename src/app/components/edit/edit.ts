import {Component} from '@angular/core'
import {RouteSegment} from '@angular/router'

import {EditComponent} from './edit.component'

@Component({
  template: '<edit-component [originalFileName]="file"></edit-component>',
  directives: [EditComponent],
})
export class Edit {
  private file: string

  constructor(segment: RouteSegment) {
    this.file = segment.getParam('post')
  }
}
