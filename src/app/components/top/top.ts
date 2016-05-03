import {Component} from '@angular/core'
import {HTTP_PROVIDERS, Http, Request, Response} from '@angular/http'

import {Const} from '../../const'
import {Util} from '../../util/util'

@Component({
  selector: 'top',
  templateUrl: 'app/components/top/top.html',
  styleUrls: ['app/components/top/top.css'],
  providers: [HTTP_PROVIDERS],
  directives: [],
  pipes: []
})
export class Top {
  private posts: any

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.http.request(new Request({
      method: 'GET',
      url: `${Const.API}?action=list`,
    })).subscribe((response: Response) => {
      const json = response.json()
      this.posts = json.posts
      this.posts.forEach(post => {
        post.date = Util.parseDate(post.date)
        if (!('title' in post) || post.title.trim() == '') {
          post.title = '(NO TITLE)'
        }
      })
    })
  }
}



/*
import kModuleName from './app_module_def'

import Const from './const'
import Util from './util/util'

class TopPageController {
  constructor($http) {
    this._$http = $http
    this.posts = null
    this.refresh()
  }

  refresh() {
    this._$http({method: 'GET', url: `${Const.API}?action=list`})
      .then(response => {
        this.posts = response.data.posts
        this.posts.forEach(post => {
          post.date = Util.parseDate(post.date)
          if (!('title' in post) || post.title.trim() == '') {
            post.title = '(NO TITLE)'
          }
        })
      }, response => {
        console.error(response)
      })
  }

  createNewPost() {

  }
}
angular.module(kModuleName)
  .component('topPage', {
    controller: ['$http', TopPageController],
    template: require('./_top.page.html'),
  })

class NewPostButtonController {
  constructor($location) {
    this._$location = $location
  }

  createNewPost() {
    this._$location.path('/new_post')
  }
}
angular.module(kModuleName)
  .component('newPostButton', {
    controller: ['$location', NewPostButtonController],
    template: `
      <a class="btn btn-success" href="#/new_post">New post</a>
      `,
  })
*/
