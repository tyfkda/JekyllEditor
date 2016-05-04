import {Component} from '@angular/core'
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated'

import {Top} from './components/top/top'
import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'

@Component({
  selector: 'seed-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/seed-app.html',
})
@RouteConfig([
  { path: '/top', component: Top, name: 'Top', useAsDefault: true },
  { path: '/edit/:post', component: Edit, name: 'Edit' },
  { path: '/new_post/', component: NewPost, name: 'NewPost' },
])
export class SeedApp {
  constructor() {}
}
