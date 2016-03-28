import kModuleName from './app_module_def'

import Const from './const'

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
      }, response => {
        console.error(response)
      })
  }

  getPostUrl(post) {
    return `#/edit/${post.file}`
  }

  createNewPost() {

  }
}
angular.module(kModuleName)
  .component('topPage', {
    controller: ['$http', TopPageController],
    template: `
      <h1>Posts</h1>
      <div>
        <button class="btn btn-primary" ng-click="$ctrl.refresh()">Refresh</button>
        <new-post-button></new-post-button>
      </div>
      <div ng-show="$ctrl.posts==null">
        Loading...
      </div>
      <div ng-show="$ctrl.posts.length==0">
        No posts
      </div>
      <ul ng-show="$ctrl.posts&&$ctrl.posts.length!=0">
        <li ng-repeat="post in $ctrl.posts">
          {{post.date}} <a ng-href="{{$ctrl.getPostUrl(post)}}">{{post.title}}</a>
        </li>
      </ul>
    `,
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
    `
  })
