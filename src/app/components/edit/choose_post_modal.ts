import {Component, Output, ViewChild, EventEmitter} from '@angular/core'
import {HTTP_PROVIDERS, Http, Response} from '@angular/http'

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
  @ViewChild(ModalComponent) protected modal: ModalComponent
  @Output() protected onSelect = new EventEmitter()
  @Output() protected onCancel = new EventEmitter()

  private posts: any
  private filteredPosts: any
  private filter: string

  constructor(private http: Http) {
  }

  protected onFilterChanged(filter) {
    if (filter === '') {
      this.filteredPosts = this.posts
      return
    }

    const re = new RegExp(filter, 'i')
    this.filteredPosts = this.posts.filter((post) => {
      return (post.title.match(re) ||
              (post.tags && post.tags.some(tag => tag.match(re))))
    })
  }

  protected open() {
    this.http.get(`${Const.API}?action=list`)
      .subscribe((response: Response) => {
        const json = response.json()
        this.posts = this.filteredPosts = json.posts
        this.posts.forEach(post => post.date = Util.parseDate(post.date))
        this.filter = ''
        this.modal.open()
      }/*, response => {
        this._$uibModal.dismiss(response)
      }*/)
  }

  protected onPostClicked(post) {
    this.modal.close()
    this.onSelect.emit(post)
  }

  protected onPostCanceled() {
    this.modal.dismiss()
    this.onCancel.emit(null)
  }
}
