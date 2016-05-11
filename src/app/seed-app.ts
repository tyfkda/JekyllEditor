import {Component} from '@angular/core'
import {Router, Routes, ROUTER_DIRECTIVES} from '@angular/router'

import {Top} from './components/top/top'
import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'

@Component({
  selector: 'seed-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  template: require('./seed-app.html'),
})
@Routes([
  { path: '/', component: Top },
  { path: '/edit/:post', component: Edit },
  { path: '/new_post', component: NewPost },
])
export class SeedApp {
  constructor() {}
}
