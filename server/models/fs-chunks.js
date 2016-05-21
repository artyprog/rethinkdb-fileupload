import thinky from '../db';
const type = thinky.type;
const FsChunks = thinky.createModel("fs_chunks", {
  id: type.string(),
  fileId: type.string(),
  data: type.buffer(),
  index: type.number(),
  size: type.number()
});

FsChunks.ensureIndex("fileIdIndex", function(doc) {
    return doc("fileId").add(doc("index"));
});

export default FsChunks;