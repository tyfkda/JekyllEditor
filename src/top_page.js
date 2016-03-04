import kModuleName from './app_module_def'

class TopPageController {
  constructor($http) {
    $http({method: 'GET', url: '/api?action=list'})
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
      <ul ng-show="$ctrl.posts&&$ctrl.posts.length!=0">
        <li ng-repeat="post in $ctrl.posts">
          <a ng-href="{{post.url}}">{{post.text}}</a>
        </li>
      </ul>
      <div ng-show="!$ctrl.posts||$ctrl.posts.length==0">
        No posts
      </div>
    `,
  })
