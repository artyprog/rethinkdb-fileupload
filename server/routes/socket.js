'use strict';

import debug from 'debug';
import _ from 'lodash';
import Message from '../models/message';
import FsChunks from '../models/fs-chunks';

const errorlog = debug('app:socket:error');
const log = debug('app:socket:log');

exports.startUpload = function (meta, ack) {
  log('upload.start', meta);
  Message.save(meta)
    .then(message => {
      ack(message.id);
    })
    .catch( e => errorlog(e));
};

exports.chunkUpload = function(chunk,ack) {
  log('upload.data', chunk);
  FsChunks.save(chunk)
    .then(_=>ack())
    .catch( e => errorlog(e));

};

exports.finishUpload = function(data) {
  log('upload.finish',data);
  Message.get(data.fileId)
  .then(doc => doc.merge({
    complete: true
  }).save())
  .catch(e => errorlog(e));
};

exports.deleteUpload = function(data) {
  log('upload.delete',data);
  Message.get(data.id)
    .then(doc => doc.purge())
    .catch( e => errorlog(e));
};

