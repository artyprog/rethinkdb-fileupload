'use strict';

import debug from 'debug';
import Message from '../models/messages';
import FsChunks from '../models/fs-chunks';

const errorlog = debug('app:socket:error');
const log = debug('app:socket:log');

export function startUpload (ack) {
  log('upload.start');
  Message.uuid()
    .then(uuid => {
      ack(uuid);
    })
    .catch( e => errorlog(e));
}

export function chunkUpload(chunk,ack) {
  log('upload.data', chunk.index);
  FsChunks.save(chunk)
    .then(_=>ack())
    .catch( e => errorlog(e));

}

export function finishUpload(data) {
  log('upload.finish',data);
  Message.save(data)
  .catch(e => errorlog(e));
}

export function deleteUpload(data) {
  log('upload.delete',data);
  Message.get(data.id).default(null)
    .then(doc => {
      if(doc)
        return doc.deleteAll();
      else
        return Promise.resolve();
    })
    .then( _=> FsChunks.getAll(data.id,{index: 'fileId'}).delete())
    .catch( e => errorlog(e));
}

