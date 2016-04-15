import kModuleName from './app_module_def'

import './choose_post.service'
import './edit.component'
import './edit.page'
import './new_post.page'
import './top.page'

const APP = 'app'
angular.module(APP, ['ngRoute', kModuleName])

// Routing
angular.module(APP)
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<top-page></top-page>',
      })
      .when('/new_post', {
        template: '<new-post-page></new-post-page>',
      })
      .when('/edit/:file', {
        template: '<edit-page></edit-page>',
      })
      .otherwise({
        redirectTo: '/',
      })
  }])

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
