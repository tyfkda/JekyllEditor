import kModuleName from './app_module_def'

class NewPostPageController {
  constructor() {
  }
}
angular.module(kModuleName)
  .component('newPostPage', {
    controller: [NewPostPageController],
    template: `
      <edit-component></edit-component>
    `,
  })
