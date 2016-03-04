class AppController {
  constructor() {
    console.log('AppController')
  }
}

const TopPageComponent = {
  controller: function() {
  },
  template: `
    <div>Top!</div>
    <a href="#/edit">edit</a>
  `,
}

const EditPageComponent = {
  controller: function() {
  },
  template: `
    <div>Edit!</div>
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
      .when('/edit', {
        template: '<edit-page></edit-page>',
      })
      .otherwise({
        redirectTo: '/',
      })
  }])
  .controller('AppController', [AppController])
  .component('topPage', TopPageComponent)
  .component('editPage', EditPageComponent)

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
