import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {EditModule} from '../edit/edit.module'

import {NewPost} from './new_post'

@NgModule({
  imports: [
    BrowserModule,
    EditModule,
  ],
  declarations: [
    NewPost,
  ],
  providers: [
  ],
})
export class NewPostModule {}
