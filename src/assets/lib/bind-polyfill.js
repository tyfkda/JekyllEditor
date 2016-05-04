// Failed on AngularMocks1.5
// https://github.com/angular/angular.js/issues/13794#issuecomment-172675811
// https://github.com/conversocial/phantomjs-polyfill/blob/master/bind-polyfill.js
if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = function bind(obj) {
    const args = Array.prototype.slice.call(arguments, 1)
    return (function(self) {
      const nop = function() {}
      const bound = function() {
        return self.apply(this instanceof nop ? this : (obj || {}),
                          args.concat(Array.prototype.slice.call(arguments)))
      }
      nop.prototype = this.prototype || {}
      bound.prototype = new nop()
      return bound
    })(this)
  }
}
