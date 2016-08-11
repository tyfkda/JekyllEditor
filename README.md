JekyllEditor
============

Web frontend for Jekyll, running on Apache/CGI.


## Requirement for development

  * node.js
  * npm
  * Ruby
  * Rubygems


## Set up

```
$ npm install
$ bundle install
```

### Install gem packges manually

You cannot use `bundle install` && `bundle exec`,
you must install required modules using `gem install`,
because this app is intended to work for Apache CGI.
So it must work on system's Ruby.

Please refer `Gemfile.lock`, and install those modules manually.

```sh
$ gem install foobar -v x.y.z
```


## Usage

### Build (automatically)

Start server:

```
$ npm start
```

Start building files:

```
$ npm run develop
```

* You can see the page in http://localhost:3000/

### Build (one shot)

```
$ npm run build
```

* Files are generated in `public`

### Release

```
$ npm run release
```

* Files are generated in `release`

### Clean up

```
$ npm run clean
```
