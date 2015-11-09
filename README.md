# save-static [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Save Express responses to a static directory for disk caching

Use save-static as a callback on Express [`Application.render()`](http://expressjs.com/4x/api.html#app.render) or [`Response.render()`](http://expressjs.com/4x/api.html#res.render) and it will:

- Write the rendered response body (HTML) to a file on disk
  - after sending the response to the client (to avoid slow responses)

Then subsequent requests can be served from disk using:
  - [`Express.static()`](http://expressjs.com/4x/api.html#express.static)
  - [Nginx](https://www.nginx.com/resources/admin-guide/serving-static-content/)

Use in conjunction with [serve-static-x](https://github.com/busterc/serve-static-x) for caching and re-caching files to disk.

## Install

```sh
$ npm install --save save-static
```


## Usage

```js
// be sure to require it
var SaveStatic = require('save-static');

// initialize with the root path for saving to disk
var staticPath = __dirname + '/static'; // <= for example
var saveStatic = new SaveStatic(staticPath);

// ...

// here's a sample Express route
app.get('/nfl/afc/east/teams', function(req, res, next) {

  res.render('division', {
    teams: ['Patriots', 'Jets', 'Bills', 'Dolphins']
  }, saveStatic(res)); // <= easy as that

  // the render HTML will be saved to a file on disk at:
  // staticPath + /nfl/afc/east/teams.html

  // NOTE: you can pass a callback too, e.g. saveStatic(res, next)
  // however, if there is no error, the response will have already
  // been sent to the client.

  // NOTE: a route for "/" will be saved on disk as 'index.html'

  // NOTE: a route for "/something.xhtml" will be saved 
  // on disk as 'something.xhtml'

};
```

## License

ISC © [Buster Collings](https://about.me/buster)


[npm-image]: https://badge.fury.io/js/save-static.svg
[npm-url]: https://npmjs.org/package/save-static
[travis-image]: https://travis-ci.org/busterc/save-static.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/save-static
[daviddm-image]: https://david-dm.org/busterc/save-static.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/save-static
