import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated'

@Component({
  selector: 'new-post-button',
  template: '<a class="btn btn-success" [routerLink]="[\'/NewPost\']">New post</a>',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
export class NewPostButton {
  private posts: any

  constructor() {
  }
}
