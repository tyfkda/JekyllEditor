import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule}  from '@angular/forms'
import {HttpModule} from '@angular/http'
import {RouterModule} from '@angular/router'

import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal'

import {ArticleEditor} from './article-editor'
import {ChoosePostModal} from './choose_post_modal'
import {DateButton} from './date_button'
import {Edit} from './edit'
import {EditComponent} from './edit.component'
import {ModalButton} from './modal_button'
import {Previewer} from './previewer'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    Ng2Bs3ModalModule,
  ],
  declarations: [
    ArticleEditor,
    ChoosePostModal,
    DateButton,
    Edit,
    EditComponent,
    ModalButton,
    Previewer,
  ],
  exports: [
    EditComponent,
  ],
  providers: [
  ],
})
export class EditModule {}
