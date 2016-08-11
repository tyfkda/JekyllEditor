import {Component, Input, Output, EventEmitter} from '@angular/core'

@Component({
  selector: 'article-editor',
  template: require('./article-editor.html'),
})
export class ArticleEditor {
  @Input() protected params: any
  @Output() protected onSaveRequested = new EventEmitter()

  protected onKeyUp(event) {
    if (event.keyCode === 83 && event.ctrlKey)  // Ctrl+S
      this.onSaveRequested.emit(null)
  }
}
