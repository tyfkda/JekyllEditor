const TopPageComponent = {
  controller: ['$http', function($http) {
    $http({method: 'GET', url: '/api?action=list'})
      .then(response => {
        this.posts = response.data.posts.map(post => {
          return {
            url: `#/edit/${post}`,
            text: post,
          }
        })
      }, response => {
        console.error(response)
      })
  }],
  template: `
    <h1>Posts</h1>
    <ul ng-show="$ctrl.posts&&$ctrl.posts.length!=0">
      <li ng-repeat="post in $ctrl.posts">
        <a ng-href="{{post.url}}">{{post.text}}</a>
      </li>
    </ul>
    <div ng-show="!$ctrl.posts||$ctrl.posts.length==0">
      No posts
    </div>
  `,
}

const EditPageComponent = {
  controller: ['$routeParams', '$http', '$sce', '$timeout', function($routeParams, $http, $sce, $timeout) {
    this.file = $routeParams.file

    $http({method: 'GET', url: `/api?action=post&file=${this.file}`})
      .then(response => {
        const html = response.data.html
        this.contents = response.data.contents
        this.preview = $sce.trustAsHtml(html)

        $timeout(() => {
          MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        })
      }, response => {
        console.error(response)
      })

    this.save = () => {
      $http({method: 'POST', url: `/api?action=post&file=${this.file}`})
        .then(response => {
          console.log(response)
        }, response => {
          console.error(response)
        })
    }
  }],
  template: `
    <div style="position: relative; height:52px; overflow: hidden;">
      <div style="position: absolute; left: 0; top: 0; right: 100px; bottom: 0;">
        <a href="#/">back</a>
        <input type="text" value="{{$ctrl.file}}" style="font-size: 1.5em; width: 50%; margin: 4px; padding: 4px; border: 1px solid gray; border-radius: 6px;">
      </div>
      <div style="position: absolute; top: 0; right: 0px; width: 100px; height: 100%;">
        <button class="save-btn" ng-click="$ctrl.save()">Save</button>
      </div>
    </div>
    <div style="position: absolute; left: 0; top: 52px; right: 0; bottom: 0;">
      <div style="position: absolute; width: 50%; height: 100%; left: 0; top: 0;">
        <div style="position: absolute; left: 4px; top: 4px; right: 0; bottom: 4px;">
          <div style="position: absolute; width: 100%; height: 100%;">
            <textarea style="width: 100%; height: 100%; padding: 4px; border: 1px solid gray; border-radius: 6px 0 0 6px; resize: none;">{{$ctrl.contents}}</textarea>
          </div>
        </div>
      </div>
      <div style="position: absolute; width: 50%; height: 100%; right: 0; top: 0;">
        <div style="position: absolute; left: 0; top: 4px; right: 4px; bottom: 4px; border: 1px solid gray; border-radius: 0 6px 6px 0;">
          <div style="position: absolute; width: 100%; height: 100%; overflow-y: scroll; padding: 4px;" ng-bind-html="$ctrl.preview">
          </div>
        </div>
      </div>
    </div>
  `,
}

const APP = 'app'
angular.module(APP, ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<top-page></top-page>',
      })
      .when('/edit/:file', {
        template: '<edit-page></edit-page>',
      })
      .otherwise({
        redirectTo: '/',
      })
  }])
  .component('topPage', TopPageComponent)
  .component('editPage', EditPageComponent)

angular.element(document).ready(() => {
  angular.bootstrap(document, [APP])
})
