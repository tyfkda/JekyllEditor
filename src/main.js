import kModuleName from './app_module_def'

import './edit_page'
import './top_page'

const APP = 'app'
angular.module(APP, ['ngRoute', kModuleName])

// Routing
angular.module(APP)
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

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
