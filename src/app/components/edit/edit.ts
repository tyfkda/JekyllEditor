import {Component} from '@angular/core'
import {ActivatedRoute} from '@angular/router'

import {EditComponent} from './edit.component'

@Component({
  template: '<edit-component [originalFileName]="file"></edit-component>',
  directives: [EditComponent],
})
export class Edit {
  private file: string

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.file = params['post']
    })
  }
}
