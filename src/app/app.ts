import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES} from '@angular/router'

@Component({
  selector: 'app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  template: require('./app.html'),
})
export class App {
  constructor() {}
}
