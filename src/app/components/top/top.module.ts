import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {HttpModule} from '@angular/http'
import {RouterModule} from '@angular/router'

import {NewPostButton} from './new_post_button'
import {Top} from './top'

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
  ],
  declarations: [
    NewPostButton,
    Top,
  ],
  providers: [
  ],
})
export class TopModule {}
