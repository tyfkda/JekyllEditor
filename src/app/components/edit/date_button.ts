/**
 * Input:
 *   - Input: date
 *   - Output: dateChange
 */

import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core'

import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal'

@Component({
  selector: 'date-button',
  template: require('./date_button.html'),
})
export class DateButton {
  @Input() private date: string
  @Output() private dateChange = new EventEmitter()
  @ViewChild(ModalComponent) private modal: ModalComponent

  protected ngAfterViewInit() {
    this.modal.onClose
      .subscribe(() => {
        this.date = $('.datepicker').val()
        this.dateChange.emit(this.date)
      })
  }

  protected startEditDate() {
    $('.datepicker').datepicker('update', this.date)
  }
}
