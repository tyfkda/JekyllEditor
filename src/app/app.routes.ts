import {provideRouter, RouterConfig} from '@angular/router'

import {Top} from './components/top/top'
import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'

const routes: RouterConfig = [
  { path: '', component: Top },
  { path: 'edit/:post', component: Edit },
  { path: 'new_post', component: NewPost },
]

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
]
