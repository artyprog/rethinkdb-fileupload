"use strict";

import debug from 'debug';
import routes from './routes/socket';
import Message from './models/message';

const errorlog = debug('app:socket:error');
const log = debug('app:socket:log');

module.exports = app => {
  app.io
    .on('connection', function(socket){

      /*FILE UPLOAD*/
      socket.on('upload.start', routes.startUpload);
      socket.on('upload.data', routes.chunkUpload);
      socket.on('upload.finish', routes.finishUpload);
      socket.on('upload.delete', routes.deleteUpload);
      socket.on('error', e => errorlog(e.stack));
    });

  // Message changefeed
  Message.changes()
    .then((feed) => {
      feed.each( (e, doc) => {
        if(doc.isSaved() && doc.getOldValue() && doc.complete){
          app.io.emit('message.new', doc);
        }
      });
    })
    .catch( e => errorlog(e));
};