import {Component} from '@angular/core'
import {Http, Response} from '@angular/http'

import {Const} from '../../const'
import {Util} from '../../util/util'
import {NewPostButton} from './new_post_button'

@Component({
  template: require('./top.html'),
})
export class Top {
  private loading: boolean
  private posts: any
  private error: string

  constructor(private http: Http) {
  }

  protected ngOnInit() {
    this.refresh()
  }

  private refresh() {
    this.loading = true
    this.http.get(`${Const.API}?action=list`)
      .subscribe((response: Response) => {
        const json = response.json()
        this.posts = json.posts
        this.posts.forEach(post => {
          post.date = Util.parseDate(post.date)
          if (!('title' in post) || post.title.trim() === '') {
            post.title = '(NO TITLE)'
          }
        })
        this.loading = false
      }, (error) => {
        console.error('Handle error')
        console.error(error)
        this.loading = false
        this.error = error.toString()
      })
  }
}
