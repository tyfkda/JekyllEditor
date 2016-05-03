import {Component} from '@angular/core'
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated'

import {Top} from './components/top/top'

@Component({
  selector: 'seed-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/seed-app.html',
})
@RouteConfig([
  { path: '/top', component: Top, name: 'Top', useAsDefault: true },
])
export class SeedApp {
  constructor() {}
}
