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
    <div>Top!</div>
    <ul>
      <li ng-repeat="post in $ctrl.posts">
        <a ng-href="{{post.url}}">{{post.text}}</a>
      </li>
    </ul>
    <a href="#/edit">edit</a>
  `,
}

const EditPageComponent = {
  controller: ['$routeParams', function($routeParams) {
    this.file = $routeParams.file
  }],
  template: `
    <div>
      {{$ctrl.file}}
    </div>
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
