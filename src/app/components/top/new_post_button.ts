import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES} from '@angular/router'

@Component({
  selector: 'new-post-button',
  template: '<a class="btn btn-success" [routerLink]="[\'/new_post\']">New post</a>',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
export class NewPostButton {
  private posts: any

  constructor() {
  }
}
