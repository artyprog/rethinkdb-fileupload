"use strict";
import thinky from '../db';
import FsChunks from './fs-chunks';
import {Transform} from 'stream';

const type = thinky.type;

const Message = thinky.createModel("messages", {
  id: type.string(),
  type: type.string(),
  name: type.string(),
  size: type.number(),
  chunkSize: type.number(),
  createdAt: type.date().default(thinky.r.now())
});

// Stream file chunks
Message.define("stream", function() {
  const transform = new Transform({
    transform: function(chunk, encoding, next) {
      this.push(chunk.data);
      next();
    },
    objectMode: true
  });
  return FsChunks.getAll(this.id, {index: 'fileId'})
    .orderBy('index')
    .pluck('data')
    .toStream()
    ._query
    .pipe(transform);
});

// Genereate uuid
Message.defineStatic("uuid", function(){
  return thinky.r.uuid().run();
});

Message.hasMany(FsChunks, "chunks", "id", "fileId");

export default Message;