'use strict';

import debug from 'debug';
import Message from '../models/messages';
import FsChunks from '../models/fs-chunks';

const errorlog = debug('app:socket:error');
const log = debug('app:socket:log');

export function startUpload (meta, ack) {
  log('upload.start', meta);
  Message.save(meta)
    .then(message => {
      ack(message.id);
    })
    .catch( e => errorlog(e));
}

export function chunkUpload(chunk,ack) {
  log('upload.data', chunk);
  FsChunks.save(chunk)
    .then(_=>ack())
    .catch( e => errorlog(e));

}

export function finishUpload(data) {
  log('upload.finish',data);
  Message.get(data.fileId)
  .then(doc => doc.merge({
    complete: true
  }).save())
  .catch(e => errorlog(e));
}

export function deleteUpload(data) {
  log('upload.delete',data);
  Message.get(data.id)
    .then(doc => doc.purge())
    .catch( e => errorlog(e));
}

