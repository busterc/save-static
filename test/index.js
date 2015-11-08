import http from 'http';
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import express from 'express';
import requestor from 'request';
import SaveStatic from '../lib';

describe('save-static', function () {

  var baseUrl = 'http://127.0.0.1:';
  var server;
  var staticPath;

  before(() => {
    var app = express();
    staticPath = __dirname + '/static';
    var saveStatic = new SaveStatic(staticPath);

    app.use(express.static(staticPath));

    app.set('views', __dirname);
    app.set('view engine', 'jade');

    app.get(['/sub-level/timestamp', '/timestamp', '/'], (request, response, next) => {
      response.render('timestamp', {
        timestamp: Date()
      }, saveStatic(response, next));
    });

    app.get(['/fail'], (request, response) => {
      response.render('fail', saveStatic(response));
    });

    server = http.createServer(app)
      .listen();
    baseUrl += server.address()
      .port;
  });

  after(() => {
    server.close();
  });

  it('requires a root path for init', done => {
    try {
      /*eslint no-unused-vars:0*/
      var failedSaveStatic = new SaveStatic();
      var noFailError = new Error('new SaveStatic() should have failed');
      done(noFailError);
    } catch (initError) {
      done();
    }
  });

  it('requires a response object when called', done => {
    try {
      var saveStatic = new SaveStatic(staticPath);
      saveStatic();
      var noFailError = new Error('saveStatic() should require a response');
      done(noFailError);
    } catch (saveError) {
      done();
    }
  });

  it('should fail gracefully when response.render fails', done => {
    try {
      var saveStatic = new SaveStatic(staticPath);
      var saveStaticCallback = saveStatic({});
      var result = saveStaticCallback('error', null);
      assert(result === false);
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should not save unfound page responses', done => {
    var page = baseUrl + '/page-does-not-exist?fluffy=stuff#ftw';
    var file = path.join(staticPath, '/page-does-not-exist');
    isCleanRequestSave(page, file, done, false);
  });

  it('should save an index page response', done => {
    var page = baseUrl + '/?fluffy=stuff#ftw';
    var file = path.join(staticPath, '/index');
    isCleanRequestSave(page, file, done);
  });

  it('should save a top-level path response', done => {
    var page = baseUrl + '/timestamp?fluffy=stuff#ftw';
    var file = path.join(staticPath, '/timestamp');
    isCleanRequestSave(page, file, done);
  });

  it('should save a sub-level path response', done => {
    var page = baseUrl + '/sub-level/timestamp?fluffy=stuff#ftw';
    var file = path.join(staticPath, '/sub-level/timestamp');
    isCleanRequestSave(page, file, done);
  });

  function isCleanRequestSave(page, file, done, expected = true) {
    fs.stat(file, noFileError => {
      assert(noFileError);

      requestor(page, requestError => {
        assert(!requestError);

        // give the server 100ms to write the file after responding
        setTimeout(() => {
          fs.stat(file, stillNoFileError => {
            assert(!stillNoFileError === expected);
            done();
          });
        }, 100);

      });
    });
  }

});
