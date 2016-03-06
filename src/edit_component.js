import kModuleName from './app_module_def'

import Const from './const'

class EditComponentController {
  constructor($http, $location, $sce, $timeout) {
    this._$http = $http
    this._$location = $location
    this._$sce = $sce
    this._$timeout = $timeout

    this.fileName = this.originalFileName
    this.info = {
    }
    if (this.originalFileName) {
      this.requestContents()
    }
  }

  requestContents() {
    this._$http({method: 'GET', url: `${Const.API}?action=post&file=${this.originalFileName}`})
      .then(response => {
        this.info = response.data.info
        this.contents = response.data.contents
        this.setPreviewHtml(response.data.html)
      }, response => {
        console.error(response)
        if (response.status == 404) {  // Not Found
          this._$location.path('/')
        }
      })
  }

  setPreviewHtml(previewHtml) {
    this.preview = this._$sce.trustAsHtml(previewHtml)

    this._$timeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
    })
  }

  save() {
    if (this.originalFileName == null) {  // New file.
      const t = new Date()
      this.info.date = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
    }

    const url = `${Const.API}?action=post${this.originalFileName?'&file='+this.originalFileName:''}`
    this._$http({method: 'PUT', url,
                 data: {
                   info: this.info,
                   contents: this.contents,
                 },
                })
      .then(response => {
        this.originalFileName = response.data.file
        this.setPreviewHtml(response.data.html)
      }, response => {
        console.error(response)
      })
  }

  delete() {
    const result = confirm('Delete this post?')
    if (!result)
      return
    this._$http({method: 'DELETE', url: `${Const.API}?action=post&file=${this.originalFileName}`})
      .then(response => {
        console.log(response)
        this._$location.path('/')
      }, response => {
        console.error(response)
      })
  }
}
angular.module(kModuleName)
  .component('editComponent', {
    controller: ['$http', '$location', '$sce', '$timeout', EditComponentController],
    bindings: {
      originalFileName: '@',
    },
    template: `
      <div style="position: relative; height:52px; overflow: hidden;">
        <div style="position: absolute; left: 0; top: 0; right: 100px; bottom: 0;">
          <a href="#/">back</a>
          <input type="text" ng-model="$ctrl.info.title" style="font-size: 1.5em; width: 50%; margin: 4px; padding: 4px; border: 1px solid gray; border-radius: 6px;">
        </div>
        <div style="position: absolute; top: 0; right: 0px; width: 200px; height: 100%;">
          <button class="delete-btn pull-right" ng-click="$ctrl.delete()" ng-disabled="!$ctrl.originalFileName">Delete</button>
          <button class="save-btn pull-right" ng-click="$ctrl.save()">Save</button>
          <div class="clear-fix"></div>
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
