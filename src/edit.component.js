import kModuleName from './app_module_def'

import Const from './const'
import Util from './util/util'

function zeroPadding2(n) {
  return _.padStart(String(n), 2, '0')
}

function getDateString(date) {
  const year = date.getFullYear()
  const month = zeroPadding2(date.getMonth() + 1)
  const day = zeroPadding2(date.getDate())
  return `${year}-${month}-${day}`
}

function getTimeString(date) {
  const hour = zeroPadding2(date.getHours())
  const minute = zeroPadding2(date.getMinutes())
  return `${hour}:${minute}`
}

// Article editor.
angular.module(kModuleName)
  .component('articleEditor', {
    bindings: {
      contents: '=',
      onSaveRequested: '&',
    },
    controller: function() {
      this.onKeyUp = function($event) {
        const event = $event.originalEvent
        if (event.keyCode == 83 && event.ctrlKey)  // Ctrl+S
          this.onSaveRequested()
      }
    },
    template: `
<div style="position: absolute; width: 100%; height: 100%;">
  <textarea id="article-editor-textarea"
            style="width: 100%; height: 100%; padding: 4px; border: 1px solid gray; border-radius: 6px 0 0 6px; resize: none;"
            ng-model="$ctrl.contents"
            ng-keyup="$ctrl.onKeyUp($event)"></textarea>
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
  constructor($http, $location, $sce, $timeout, ChoosePostService) {
    this._$http = $http
    this._$location = $location
    this._$sce = $sce
    this._$timeout = $timeout
    this._ChoosePostService = ChoosePostService

    this.info = {}
    this.time = '00:00'
    if (this.originalFileName) {
      this.fileName = this.originalFileName
      const m = this.fileName.match(/^(\d+-\d+-\d+)-(.*)\.(md|markdown)/)
      if (m) {
        this.date = m[1]
        this.mainName = m[2]
      }
      this.requestContents()
    } else {
      this.date = getDateString(new Date())
      this.mainName = String(new Date().getTime())
    }

    $('#edit-tag-modal').on('shown.bs.modal', function() {
      $('#tag-input').focus().select()
    })
    $('#edit-main-name-modal').on('shown.bs.modal', function() {
      $('#main-name-input').focus().select()
    })
    $('#edit-date-modal').on('shown.bs.modal', function() {
      $('#date-input').focus().select()
    })
    $('#edit-time-modal').on('shown.bs.modal', function() {
      $('#time-input').focus().select()
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
        // Get date from front_matters
        const date = Util.parseDate(this.info.date)
        this.date = getDateString(date)
        this.time = getTimeString(date)
        if ('tags' in this.info && this.info.tags) {
          this.tag = this.info.tags.join(', ')
        }
      }, response => {
        console.error(response)
        if (response.status == 404) {  // Not Found
          this._$location.path('/')
        }
      })
  }

  updateTag() {
    this.tag = this.tagForEdit
    $('#edit-tag-modal').modal('hide')
  }

  updateMainName() {
    this.mainName = this.mainNameForEdit
    $('#edit-main-name-modal').modal('hide')
  }

  startEditDate() {
    $('.datepicker').datepicker('update', this.date)
  }

  updateDate() {
    this.date = $('#date-input').val()
    $('#edit-date-modal').modal('hide')
  }

  updateTime() {
    this.time = this.timeForEdit
    $('#edit-time-modal').modal('hide')
  }

  setPreviewHtml(previewHtml) {
    this.preview = this._$sce.trustAsHtml(previewHtml)

    this._$timeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
      $('previewer a').attr({target: '_blank'})
    })
  }

  save() {
    let extension = 'md'
    this.info.date = `${this.date} ${this.time}`
    if (this.originalFileName == null) {  // New file.
      this.info.layout = Const.DEFAULT_LAYOUT
      this.info.categories = Const.DEFAULT_CATEGORIES
    } else {
      const m = this.fileName.match(/^(\d+-\d+-\d+)-(.*)\.(md|markdown)/)
      if (m) {
        extension = m[3]
      }
    }
    if (!this.info.title)
      this.info.title = 'NO TITLE'
    if (this.tag) {
      this.info.tags = this.tag.split(/,\s*/).filter(t => t)
    }

    const param = {
      action: 'post',
      file: this.originalFileName,
    }
    const newFileName = `${this.date}-${this.mainName}.${extension}`

    if (newFileName != param.file) {
      param.file = newFileName
      if (this.originalFileName)
        param.originalFileName = this.originalFileName
    }
    const url = `${Const.API}?${$.param(param)}`
    this._$http({method: 'PUT', url,
                 data: {
                   info: this.info,
                   contents: this.contents,
                 },
                })
      .then(response => {
        if (this.originalFileName !== response.data.file) {
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
      .then(_response => {
        this._$location.path('/')
      }, response => {
        console.error(response)
      })
  }

  onClickLinkToPost() {
    const textarea = $('#article-editor-textarea')
    const ta = textarea[0]
    if (ta && typeof ta.selectionStart != 'undefined' &&
        typeof ta.selectionEnd != 'undefined' &&
        ta.selectionStart < ta.selectionEnd) {
      const val = textarea.val()
      const start = ta.selectionStart, end = ta.selectionEnd
      this._ChoosePostService.openModal()
        .result.then(
          post => {
            let mainname = post.file
            const ext = mainname.lastIndexOf('.')
            if (ext >= 0)
              mainname = mainname.substring(0, ext)

            const text = val.substring(start, end)
            const newText = `[${text}]({% post_url ${mainname} %})`
            const e = document.createEvent('TextEvent')
            e.initTextEvent('textInput', true, true, null, newText, 9, 'en-US')

            ta.focus()
            ta.setSelectionRange(start, end)
            ta.dispatchEvent(e)
            ta.setSelectionRange(start, start + newText.length)
          },
          _result => {
            textarea.focus()
          })
    }
  }
}
angular.module(kModuleName)
  .component('editComponent', {
    controller: ['$http', '$location', '$sce', '$timeout', 'ChoosePostService', EditComponentController],
    bindings: {
      originalFileName: '@',
    },
    template: require('./_edit.component.html'),
  })
