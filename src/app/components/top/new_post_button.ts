import {Component} from '@angular/core'

@Component({
  selector: 'new-post-button',
  template: '<a class="btn btn-success" [routerLink]="[\'/new_post\']">New post</a>',
})
export class NewPostButton {
  protected posts: any
}
