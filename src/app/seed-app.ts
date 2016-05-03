import {Component} from '@angular/core'
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated'

import {Home} from './components/home/home'

@Component({
  selector: 'seed-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/seed-app.html',
})
@RouteConfig([
  { path: '/home', component: Home, name: 'Home', useAsDefault: true },
])
export class SeedApp {
  constructor() {}
}
