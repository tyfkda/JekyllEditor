import kModuleName from './app_module_def'

import Const from './const'

// Article editor.
angular.module(kModuleName)
  .component('articleEditor', {
    bindings: {
      contents: '=',
    },
    template: `
<div style="position: absolute; width: 100%; height: 100%;">
  <textarea style="width: 100%; height: 100%; padding: 4px; border: 1px solid gray; border-radius: 6px 0 0 6px; resize: none;"
            ng-model="$ctrl.contents"></textarea>
</div>
      `})

// Previewer component.
angular.module(kModuleName)
  .component('previewer', {
    bindings: {
      html: '=',
    },
    template: `
<div style="position: absolute; width: 100%; height: 100%; overflow-y: scroll; padding: 4px;"
     ng-bind-html="$ctrl.html">
</div>
      `})

// Edit component.
class EditComponentController {
  constructor($http, $location, $sce, $timeout) {
    this._$http = $http
    this._$location = $location
    this._$sce = $sce
    this._$timeout = $timeout

    this.info = {
    }
    if (this.originalFileName) {
      this.fileName = this.originalFileName
      const m = this.fileName.match(/^(\d+-\d+-\d+)-(.*)(.md)/)
      if (m) {
        this.date = m[1]
        this.mainName = m[2]
      }
      this.requestContents()
    } else {
      const d = new Date()
      const zeroPadding2 = (n) => _.padStart(String(n), 2, '0')
      this.date = `${d.getFullYear()}-${zeroPadding2(d.getMonth() + 1)}-${zeroPadding2(d.getDate())}`
    }
    this.dateForEdit = this.date

    $('#edit-main-name-modal').on('shown.bs.modal', function() {
      $('#main-name-input').focus().select()
    })
    $('#edit-date-modal').on('shown.bs.modal', function() {
      $('#date-input').focus().select()
    })

    $timeout(() => {
      $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
      })
    })
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

  updateMainName() {
    this.mainName = this.mainNameForEdit
    $('#edit-main-name-modal').modal('hide')
  }

  startEditDate() {
    this.dateForEdit = this.date
    $('.datepicker').datepicker('update', this.dateForEdit)
  }

  updateDate() {
    this.date = this.dateForEdit
    $('#edit-date-modal').modal('hide')
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
      this.info.layout = Const.DEFAULT_LAYOUT
      this.info.categories = Const.DEFAULT_CATEGORIES
    }

    const url = `${Const.API}?action=post${this.originalFileName?'&file='+this.originalFileName:''}`
    this._$http({method: 'PUT', url,
                 data: {
                   info: this.info,
                   contents: this.contents,
                 },
                })
      .then(response => {
        if (this.originalFileName == null) {
          // Redirect to edit page.
          return this._$location.path(`edit/${response.data.file}`).replace()
        }
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
        <div style="position: absolute; left: 0; top: 0; right: 350px; bottom: 0;">
          <a class="btn btn-primary" href="#/">Back</a>
          <input type="text" ng-model="$ctrl.info.title" style="font-size: 1.5em; width: 50%; margin: 4px; padding: 4px; border: 1px solid gray; border-radius: 6px;">
        </div>
        <div class="clearfix" style="position: absolute; top: 0; right: 0px; width: 350px; height: 100%;">
          <button class="btn btn-danger pull-right" ng-click="$ctrl.delete()" ng-disabled="!$ctrl.originalFileName">Delete</button>
          <button class="btn btn-success pull-right" ng-click="$ctrl.save()">Save</button>
          <button class="btn btn-normal pull-right"
                  style="margin-right: 16px; width: 100px; overflow: hidden;"
                  ng-click="$ctrl.mainNameForEdit=$ctrl.mainName"
                  data-toggle="modal" data-target="#edit-main-name-modal">{{$ctrl.mainName?$ctrl.mainName:'MainName'}}</button>
          <button class="btn btn-normal pull-right"
                  ng-click="$ctrl.startEditDate()"
                  data-toggle="modal" data-target="#edit-date-modal">{{$ctrl.date?$ctrl.date:'Date'}}</button>

          <div id="edit-main-name-modal" class="modal">
            <div class="modal-content">
              <div class="modal-header">Edit mainname</div>
              <div class="modal-body">
                <input id="main-name-input" type="text"
                       ng-model="$ctrl.mainNameForEdit"
                       ng-keyup="$event.keyCode==13&&$ctrl.updateMainName()">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" ng-click="$ctrl.updateMainName()">OK</button>
              </div>
            </div>
          </div>
          <div id="edit-date-modal" class="modal">
            <div class="modal-content">
              <div class="modal-header">Edit date</div>
              <div class="modal-body">
                <!--input id="date-input-old" type="text"
                       class="form-control datepicker"
                       ng-model="$ctrl.dateForEdit"
                       value="{{$ctrl.dateForEdit}}"
                       xxxng-keyup="$event.keyCode==13&&$ctrl.updateDate()"-->
                <input id="date-input"
                       class="form-control datepicker"
                       ng-model="$ctrl.dateForEdit">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" ng-click="$ctrl.updateDate()">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="position: absolute; left: 0; top: 52px; right: 0; bottom: 0;">
        <div style="position: absolute; width: 50%; height: 100%; left: 0; top: 0;">
          <div style="position: absolute; left: 4px; top: 4px; right: 0; bottom: 4px;">
            <article-editor contents="$ctrl.contents"></article-editor>
          </div>
        </div>
        <div style="position: absolute; width: 50%; height: 100%; right: 0; top: 0;">
          <div style="position: absolute; left: 0; top: 4px; right: 4px; bottom: 4px; border: 1px solid gray; border-radius: 0 6px 6px 0;">
            <previewer html="$ctrl.preview"></previewer>
          </div>
        </div>
      </div>
    `,
  })
