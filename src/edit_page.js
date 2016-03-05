import kModuleName from './app_module_def'

import Const from './const'

class EditPageController {
  constructor($routeParams, $http, $sce, $timeout) {
    this._$http = $http
    this._$sce = $sce
    this._$timeout = $timeout

    this.file = $routeParams.file

    this.requestContents()
  }

  requestContents() {
    this._$http({method: 'GET', url: `${Const.API}?action=post&file=${this.file}`})
      .then(response => {
        this.contents = response.data.contents
        this.setPreviewHtml(response.data.html)
      }, response => {
        console.error(response)
      })
  }

  setPreviewHtml(previewHtml) {
    this.preview = this._$sce.trustAsHtml(previewHtml)

    this._$timeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
    })
  }

  save() {
    this._$http({method: 'PUT', url: `${Const.API}?action=post&file=${this.file}`,
                 data: this.contents
                })
      .then(response => {
        this.setPreviewHtml(response.data.html)
      }, response => {
        console.error(response)
      })
  }
}
angular.module(kModuleName)
  .component('editPage', {
    controller: ['$routeParams', '$http', '$sce', '$timeout', EditPageController],
    template: `
      <div style="position: relative; height:52px; overflow: hidden;">
        <div style="position: absolute; left: 0; top: 0; right: 100px; bottom: 0;">
          <a href="#/">back</a>
          <input type="text" value="{{$ctrl.file}}" style="font-size: 1.5em; width: 50%; margin: 4px; padding: 4px; border: 1px solid gray; border-radius: 6px;">
        </div>
        <div style="position: absolute; top: 0; right: 0px; width: 100px; height: 100%;">
          <button class="save-btn" ng-click="$ctrl.save()">Save</button>
        </div>
      </div>
      <div style="position: absolute; left: 0; top: 52px; right: 0; bottom: 0;">
        <div style="position: absolute; width: 50%; height: 100%; left: 0; top: 0;">
          <div style="position: absolute; left: 4px; top: 4px; right: 0; bottom: 4px;">
            <div style="position: absolute; width: 100%; height: 100%;">
              <textarea style="width: 100%; height: 100%; padding: 4px; border: 1px solid gray; border-radius: 6px 0 0 6px; resize: none;"
                        ng-model="$ctrl.contents"></textarea>
            </div>
          </div>
        </div>
        <div style="position: absolute; width: 50%; height: 100%; right: 0; top: 0;">
          <div style="position: absolute; left: 0; top: 4px; right: 4px; bottom: 4px; border: 1px solid gray; border-radius: 0 6px 6px 0;">
            <div style="position: absolute; width: 100%; height: 100%; overflow-y: scroll; padding: 4px;" ng-bind-html="$ctrl.preview">
            </div>
          </div>
        </div>
      </div>
    `,
  })
