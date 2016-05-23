import debug from 'debug';
import * as routes from './routes/socket';
import Message from './models/messages';

const errorlog = debug('app:socket:error');
const log = debug('app:socket:log');

export default function(app) {
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
        // new message
        if(doc.getOldValue() === null){
          app.io.emit('message.new', doc);
        }
        else if(e){
          errorlog(e);
        }
        else{
          log('unhandled feed');
        }
      });
    })
    .catch( e => errorlog(e));
}