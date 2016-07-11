import {Component, Output, ViewChild, EventEmitter} from '@angular/core'
import {Control} from '@angular/common'
import {HTTP_PROVIDERS, Http, Request, Response} from '@angular/http'

import {Const} from '../../const'
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal'
import {Util} from '../../util/util'

@Component({
  selector: 'choose-post-modal',
  template: require('./choose_post_modal.html'),
  directives: [MODAL_DIRECTIVES],
  providers: [HTTP_PROVIDERS],
})
export class ChoosePostModal {
  @ViewChild(ModalComponent) modal: ModalComponent
  @Output() onSelect = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  posts: any
  filteredPosts: any
  filter = new Control()

  constructor(private http: Http) {
    this.filter.valueChanges
      .debounceTime(250)
      .subscribe(filter => {
        const re = new RegExp(filter, 'i')
        this.filteredPosts = this.posts.filter((post) => {
          return (post.title.match(re) ||
                  (post.tags && post.tags.some(tag => tag.match(re))))
        })
      })
  }

  open() {
    this.http.get(`${Const.API}?action=list`)
      .subscribe((response: Response) => {
        const json = response.json()
        this.posts = this.filteredPosts = json.posts
        this.posts.forEach(post => post.date = Util.parseDate(post.date))
        this.filter.updateValue('')
        this.modal.open()
      }/*, response => {
        this._$uibModal.dismiss(response)
      }*/)
  }

  onPostClicked(post) {
    this.modal.close()
    this.onSelect.emit(post)
  }

  onPostCanceled() {
    this.modal.dismiss()
    this.onCancel.emit(null)
  }
}
