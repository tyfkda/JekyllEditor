import {LocationStrategy, HashLocationStrategy} from '@angular/common'
import {bootstrap} from '@angular/platform-browser-dynamic'
import {provide, enableProdMode} from '@angular/core'
import {HTTP_PROVIDERS} from '@angular/http'
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'

import {Const} from './app/const'
import {SeedApp} from './app/seed-app'

if (!Config.isDebug) {
  enableProdMode()
}

bootstrap(SeedApp, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
])
.catch(err => console.error(err))
