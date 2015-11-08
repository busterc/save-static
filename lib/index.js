import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export default root => {
  if (!root) {
    throw new TypeError('root path must be provided');
  }

  return (response, next) => {
    if (!response) {
      throw new TypeError('response must be provided');
    }

    return (error, html) => {
      // do nothing with error, Express already calls next(error) internally
      if (error) {
        return false;
      }
      // send response optimistically (before writing to disk)
      response.send(html);

      var page = response.req.url.split('?')[0];
      page = page === '/' ? '/index.html' : page;
      var file = path.join(root, page);
      var directory = path.dirname(file);

      mkdirp(directory, mkdirpError => {
        if (next && mkdirpError) {
          return next(mkdirpError);
        }
        fs.writeFile(file, html, writeFileError => {
          if (next && writeFileError) {
            return next(writeFileError);
          }
        });
      });
    };
  };
};
