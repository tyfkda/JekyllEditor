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
        this.posts = response.data.posts.map(post => {
          return {
            url: `#/edit/${post}`,
            text: post,
          }
        })
      }, response => {
        console.error(response)
      })
  }
}
angular.module(kModuleName)
  .component('topPage', {
    controller: ['$http', TopPageController],
    template: `
      <h1>Posts</h1>
      <div>
        <button ng-click="$ctrl.refresh()">Refresh</button>
      </div>
      <div ng-show="$ctrl.posts==null">
        Loading...
      </div>
      <div ng-show="$ctrl.posts.length==0">
        No posts
      </div>
      <ul ng-show="$ctrl.posts&&$ctrl.posts.length!=0">
        <li ng-repeat="post in $ctrl.posts">
          <a ng-href="{{post.url}}">{{post.text}}</a>
        </li>
      </ul>
    `,
  })
