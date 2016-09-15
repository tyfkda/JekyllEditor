import {Routes, RouterModule} from '@angular/router'

import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'
import {Top} from './components/top/top'

const appRoutes: Routes = [
  { path: '', component: Top },
  { path: 'edit/:post', component: Edit },
  { path: 'new_post', component: NewPost },
]

export const routing = RouterModule.forRoot(appRoutes, {useHash: true})
