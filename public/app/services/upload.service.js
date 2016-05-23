angular.module('App').factory('UploadService', ['SerialFileReader', function(SerialFileReader){

  /*Uploader via Socket*/
  function Uploader(socket){
    this._socket = socket;
    this._cancelled = false;
    this._progress = 0;
    this._CHUNKSIZE = 255* 1024;
  }
  Uploader.prototype.cancel = function(){
    this._cancelled = true;
    this._socket.emit('upload.delete', {
      id: this._fileId
    });
  };

  Uploader.prototype.upload = function(file, meta){
    var self = this;
    var reader = new SerialFileReader(file, {CHUNKSIZE: self._CHUNKSIZE});
    meta = angular.extend({
      type: file.type,
      size: file.size,
      name: file.name
    }, meta);

    self._reader = reader;
    self._file = file;
    self._chunksCount = Math.ceil(self._file.size/self._CHUNKSIZE);

    setTimeout(function(){
      // start upload, receive file id
      self._socket.emit('upload.start', function acknowledged(fileId) {
        self._fileId = fileId;
        //start file reading
        reader.readNext();
      });
    });

    reader.on('data', function (chunk) {
      chunk.fileId = self._fileId;
      chunk.size = chunk.data.byteLength;

      self._socket.emit('upload.data', chunk, function acknowledged(){
        self.updateProgress();
        if(!self._cancelled)
          reader.readNext();
      });
    });

    reader.on('end', function (){
      meta.id = self._fileId;
      meta.chunkSize = self._CHUNKSIZE;
      self._socket.emit('upload.finish', meta);
      if(typeof self.onend === 'function'){
        self.onend();
      }
    });
  };

  Uploader.prototype.updateProgress = function(){
    this._progress =  (this._reader._index/this._chunksCount)*100;
  };
  Uploader.prototype.getProgress = function(){
    return this._progress;
  };
  Uploader.prototype.getSize = function(){
    return this._file.size;
  };
  Uploader.prototype.getFile = function(){
    return this._file;
  };
  Uploader.prototype.getFileId = function(){
    return this._fileId;
  };


  /* UploadService */
  function UploadService(socket){
    this._socket = socket;
  }
  UploadService.prototype.upload = function (file, data){
    var uploader = new Uploader(this._socket);
    uploader.upload(file, data);
    return uploader;
  };

  return UploadService;
}]);
