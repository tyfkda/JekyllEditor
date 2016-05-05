import {Component, Output, ViewChild, EventEmitter} from '@angular/core'
import {HTTP_PROVIDERS, Http, Request, Response} from '@angular/http'

import {Const} from '../../const'
import {MODAL_DIRECTIVES, ModalComponent} from '../../../ng2-bs3-modal/ng2-bs3-modal'

@Component({
  selector: 'choose-post',
  template: require('./choose_post.html'),
  directives: [MODAL_DIRECTIVES],
  providers: [HTTP_PROVIDERS],
})
export class ChoosePost {
  @ViewChild(ModalComponent) modal: ModalComponent
  @Output() onSelect = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  posts: any

  constructor(private http: Http) {
  }

  open() {
    this.http.get(`${Const.API}?action=list`)
      .subscribe((response: Response) => {
        const json = response.json()
        this.posts = json.posts
        this.posts.forEach(post => post.date = new Date(post.date))
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
