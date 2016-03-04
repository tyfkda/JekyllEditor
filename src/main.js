const TopPageComponent = {
  controller: ['$http', function($http) {
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
  }],
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
}

const EditPageComponent = {
  controller: ['$routeParams', '$http', function($routeParams, $http) {
    this.file = $routeParams.file
    $http({method: 'GET', url: `/api?action=post&file=${this.file}`})
      .then(response => {
        this.contents = response.data.contents
      }, response => {
        console.error(response)
      })
  }],
  template: `
    <a href="#/">back</a>
    <h1>{{$ctrl.file}}</h1>
    <pre style="border:solid 1px gray; padding:4px;">{{$ctrl.contents}}</pre>
    <a href="#/">back</a>
  `,
}

const APP = 'app'
angular.module(APP, ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<top-page></top-page>',
      })
      .when('/edit/:file', {
        template: '<edit-page></edit-page>',
      })
      .otherwise({
        redirectTo: '/',
      })
  }])
  .component('topPage', TopPageComponent)
  .component('editPage', EditPageComponent)

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
