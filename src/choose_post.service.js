import kModuleName from './app_module_def'

class ChoosePostController {
  constructor($uibModalInstance) {
    this._$uibModalInstance = $uibModalInstance
  }

  onOk() {
    this._$uibModalInstance.close('done')
  }
}

angular.module(kModuleName)
  .controller('ChoosePostController', ['$uibModalInstance', ChoosePostController])
  .service('ChoosePostService', ['$uibModal', function($uibModal) {
    this.openModal = () => {
      return $uibModal.open({
        controller: 'ChoosePostController as $ctrl',
        template: ('<div class="modal-header">Modal test</div>' +
                   '<div class="modal-body">body</div>' +
                   '<div class="modal-footer"><button class="btn btn-primary" ng-click="$ctrl.onOk()">OK</button></div>'),
      })
    }
  }])
