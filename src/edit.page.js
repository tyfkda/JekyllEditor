import kModuleName from './app_module_def'

class EditPageController {
  constructor($routeParams) {
    this.file = $routeParams.file
  }
}
angular.module(kModuleName)
  .component('editPage', {
    controller: ['$routeParams', EditPageController],
    template: `
      <edit-component original-file-name="{{$ctrl.file}}"></edit-component>
    `,
  })
