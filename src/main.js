class AppController {
  constructor() {
    console.log('AppController')
  }
}

const APP = 'app'
angular.module(APP, [])
  .controller('AppController', [AppController])

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
