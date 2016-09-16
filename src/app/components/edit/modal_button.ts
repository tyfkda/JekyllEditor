/**
 * Input:
 *   - title
 *   - width
 *   - placeHolder
 *   - Input: value
 *   - Output: valueChange
 */

import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'

import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal'

@Component({
  selector: 'modal-button',
  template: require('./modal_button.html'),
})
export class ModalButton {
  @Input() protected title: string
  @Input() protected width: string
  @Input() protected placeHolder: string
  @Input() protected value: string
  @Output() protected valueChange = new EventEmitter()
  @ViewChild(ModalComponent) protected modal: ModalComponent
  private valueForEdit: string

  protected ngOnInit() {
    this.width = this.width || '100px'
  }

  protected ngAfterViewInit() {
    this.modal.onClose
      .subscribe(() => {
        this.valueChange.emit(this.valueForEdit)
      })
  }
}
