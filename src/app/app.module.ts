import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule}  from '@angular/forms'

import {AppComponent} from './app'
import {routing, appRoutingProviders} from './app.routes'

import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'
import {Top} from './components/top/top'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
  ],
  declarations: [
    AppComponent,

    Edit,
    NewPost,
    Top,
  ],
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
