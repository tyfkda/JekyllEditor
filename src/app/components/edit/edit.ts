import {Component} from '@angular/core'
import {ActivatedRoute} from '@angular/router'

@Component({
  template: '<edit-component [originalFileName]="file"></edit-component>',
})
export class Edit {
  private file: string

  constructor(private route: ActivatedRoute) {
  }

  protected ngOnInit() {
    this.route.params.subscribe(params => {
      this.file = params['post']
    })
  }
}
