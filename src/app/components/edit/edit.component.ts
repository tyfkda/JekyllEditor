import {Component, Input} from '@angular/core'
import {Http, Response} from '@angular/http'
import {Router} from '@angular/router'
import {DomSanitizer, SafeHtml} from '@angular/platform-browser'
import * as _ from 'lodash'

import {ArticleEditor} from './article_editor'
import {ChoosePostModal} from './choose_post_modal.ts'
import {Const} from '../../const'
import {DateButton} from './date_button'
import {ModalButton} from './modal_button'
import {Previewer} from './previewer'
import {Util} from '../../util/util'

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

@Component({
  selector: 'edit-component',
  template: require('./edit.component.html'),
})
export class EditComponent {
  @Input() protected originalFileName: string

  protected info: any
  protected fileName: string
  protected mainName: string
  protected date: string
  protected time: string
  protected contents: string
  protected tag: string
  protected preview: SafeHtml

  protected timeForEdit: string
  protected edit: any

  constructor(private http: Http, private router: Router,
              private sanitizer: DomSanitizer)
  {
    this.info = {}
    this.time = '00:00'
    this.edit = {
      contents: null,
    }
  }

  protected ngOnInit() {
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

    $('.datepicker').datepicker({
      format: Const.DATE_FORMAT,
    } as JQueryUI.DatepickerOptions)
  }

  protected save() {
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
      this.info.tags = this.tag.split(/,\s*/).filter(t => t !== '')
    } else {
      delete this.info.tags
    }

    const param: any = {
      action: 'post',
      file: this.originalFileName,
    }
    const newFileName = `${this.date}-${this.mainName}.${extension}`

    if (newFileName !== param.file) {
      param.file = newFileName
      if (this.originalFileName)
        param.originalFileName = this.originalFileName
    }
    const url = `${Const.API}?${$.param(param)}`
    const body = JSON.stringify({info: this.info, contents: this.edit.contents})
    this.http.put(url, body)
      .subscribe((response: Response) => {
        const json = response.json()
        if (this.originalFileName !== json.file) {
          // Redirect to edit page.
          return this.router.navigate(['/edit', json.file])
        }
        this.setPreviewHtml(json.html)
      }, (response: Response) => {
        console.error(response)
      })
  }

  protected delete() {
    const result = confirm('Delete this post?')
    if (!result)
      return

    this.http.delete(`${Const.API}?action=post&file=${this.originalFileName}`)
      .subscribe((response: Response) => {
        this.router.navigate(['/'])
      }, (response: Response) => {
         console.error(response)
      })
  }

  protected isTextSelected(post) {
    const textarea = $('#article-editor-textarea')
    const ta: any = textarea[0]
    return (ta && typeof ta.selectionStart !== 'undefined' &&
            typeof ta.selectionEnd !== 'undefined' &&
            ta.selectionStart < ta.selectionEnd)
  }

  protected onPostChoosed(post) {
    const textarea = $('#article-editor-textarea')
    const ta: any = textarea[0]
    if (ta && typeof ta.selectionStart !== 'undefined' &&
        typeof ta.selectionEnd !== 'undefined') {
      const val = textarea.val()
      const start = ta.selectionStart, end = ta.selectionEnd
      let mainname = post.file
      const ext = mainname.lastIndexOf('.')
      if (ext >= 0)
        mainname = mainname.substring(0, ext)

      const text = (ta.selectionStart < ta.selectionEnd
                    ? val.substring(start, end)
                    : post.title)
      const newText = `[${text}]({% post_url ${mainname} %})`
      const e = document.createEvent('TextEvent')
      e.initTextEvent('textInput', true, true, null, newText, 9, 'en-US')

      ta.focus()
      ta.setSelectionRange(start, end)
      ta.dispatchEvent(e)
      ta.setSelectionRange(start, start + newText.length)
    }
  }

  protected onPostCanceled() {
    const textarea = $('#article-editor-textarea')
    textarea.focus()
  }

  private requestContents() {
    this.http.get(`${Const.API}?action=post&file=${this.originalFileName}`)
      .subscribe((response: Response) => {
        const json = response.json()
        this.info = json.info
        this.edit.contents = json.contents
        this.setPreviewHtml(json.html)
        // Get date from front_matters
        const date = Util.parseDate(this.info.date)
        this.date = getDateString(date)
        this.time = getTimeString(date)
        if ('tags' in this.info && this.info.tags) {
          this.tag = this.info.tags.join(', ')
        }
      }, (response: Response) => {
        console.error(response)
        if (response.status === 404) {  // Not Found
          this.router.navigate(['/'])
        }
      })
  }

  private setPreviewHtml(previewHtml) {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(previewHtml)
    setTimeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub])
      $('previewer a').attr({target: '_blank'})
    }, 0)
  }
}
