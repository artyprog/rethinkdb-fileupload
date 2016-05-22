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
  complete: type.boolean().default(false),
  createdAt: type.date().default(thinky.r.now())
});
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
Message.hasMany(FsChunks, "chunks", "id", "fileId");
Message.ensureIndex("complete");
export default Message;