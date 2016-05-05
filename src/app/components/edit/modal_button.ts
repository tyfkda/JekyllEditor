/**
 * Input:
 *   - title
 *   - width
 *   - placeHolder
 *   - Input: value
 *   - Output: valueChange
 */

import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'

import {Const} from '../../const'
import {MODAL_DIRECTIVES, ModalComponent} from '../../../ng2-bs3-modal/ng2-bs3-modal'

@Component({
  selector: 'modal-button',
  template: require('./modal_button.html'),
  directives: [MODAL_DIRECTIVES],
})
export class ModalButton {
  @Input() title: string
  @Input() width: string
  @Input() placeHolder: string
  @Input() value: string
  @Output() valueChange = new EventEmitter()
  @ViewChild(ModalComponent) modal: ModalComponent
  valueForEdit: string

  ngOnInit() {
    this.width = this.width || '100px'
  }

  ngAfterViewInit() {
    this.modal.onClose
      .subscribe(() => {
        this.valueChange.emit(this.valueForEdit)
      })
  }
}
