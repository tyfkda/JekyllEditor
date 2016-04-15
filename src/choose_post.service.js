import kModuleName from './app_module_def'

import Const from './const'

class ChoosePostController {
  constructor($http, $uibModalInstance) {
    this._$http = $http
    this._$uibModalInstance = $uibModalInstance
    this.refresh()
  }

  refresh() {
    this._$http({method: 'GET', url: `${Const.API}?action=list`})
      .then(response => {
        this.posts = response.data.posts
        this.posts.forEach(post => post.date = new Date(post.date))
      }, response => {
        this._$uibModal.dismiss(response)
      })
  }

  onPostClicked(post) {
    this._$uibModalInstance.close(post)
  }

  onCancel() {
    this._$uibModalInstance.dismiss()
  }
}

angular.module(kModuleName)
  .controller('ChoosePostController', ['$http', '$uibModalInstance', ChoosePostController])
  .service('ChoosePostService', ['$uibModal', function($uibModal) {
    this.openModal = () => {
      return $uibModal.open({
        controller: 'ChoosePostController as $ctrl',
        template: ('<div class="modal-header"><h3>Choose post to link</h3></div>' +
                   '<div class="modal-body"><ul><li ng-repeat="post in $ctrl.posts">{{post.date | date:\'yyyy/MM/dd\'}} <button ng-click="$ctrl.onPostClicked(post)" ng-bind="post.title"></button></li></ul></div>' +
                   '<div class="modal-footer"><button class="btn btn-secondary" ng-click="$ctrl.onCancel()">Cancel</button></div>'),
        size: 'lg',
      })
    }
  }])
