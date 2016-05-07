/**
 * Input:
 *   - Input: date
 *   - Output: dateChange
 */

import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'

import {Const} from '../../const'
import {MODAL_DIRECTIVES, ModalComponent} from '../../../ng2-bs3-modal/ng2-bs3-modal'

@Component({
  selector: 'date-button',
  template: require('./date_button.html'),
  directives: [MODAL_DIRECTIVES],
})
export class DateButton {
  @Input() date: string
  @Output() dateChange = new EventEmitter()
  @ViewChild(ModalComponent) modal: ModalComponent

  ngAfterViewInit() {
    this.modal.onClose
      .subscribe(() => {
        this.date = $('.datepicker').val()
        this.dateChange.emit(this.date)
      })
  }

  startEditDate() {
    $('.datepicker').datepicker('update', this.date)
  }
}
