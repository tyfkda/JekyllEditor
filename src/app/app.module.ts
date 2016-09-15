import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule}  from '@angular/forms'

import {EditModule} from './components/edit/edit.module'
import {NewPostModule} from './components/new_post/new_post.module'
import {TopModule} from './components/top/top.module'

import {AppComponent} from './app'
import {routing} from './app.routes'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,

    EditModule,
    NewPostModule,
    TopModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
