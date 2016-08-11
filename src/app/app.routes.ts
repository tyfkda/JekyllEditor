import {Routes, RouterModule} from '@angular/router'

import {Top} from './components/top/top'
import {Edit} from './components/edit/edit'
import {NewPost} from './components/new_post/new_post'

const appRoutes: Routes = [
  { path: '', component: Top },
  { path: 'edit/:post', component: Edit },
  { path: 'new_post', component: NewPost },
]

export const appRoutingProviders: any[] = [
]

export const routing = RouterModule.forRoot(appRoutes, {useHash: true})
