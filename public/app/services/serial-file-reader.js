angular.module('App')
  .factory('SerialFileReader', function(){
    function SerialFileReader(file, opts){
      var self = this;
  
      self._file = file;
      self._listeners = {};
      self._offset = 0;
      self._CHUNKSIZE = opts.CHUNKSIZE;
      self._index = 0;
      self._reader = new FileReader();
  
      self._reader.onload = function(evt) {
        var data = evt.target.result;
        self.emit('data', {
          data: data,
          index: self._index
        });
        self._index++;
      };
      self._reader.onerror = function(e) {
        self.emit('error', e);
      };
    }
    SerialFileReader.prototype.readNext = function(){
  
      if (this._offset >= this._file.size) {
        this.emit('end');
      } else{
        var slice = this._file.slice(this._offset, this._offset + this._CHUNKSIZE);
        this._reader.readAsArrayBuffer(slice);
        this._offset += this._CHUNKSIZE;
      }
    };
    SerialFileReader.prototype.on = function(type, listener){
      var listeners = this._listeners[type];
      if(listeners){
        listeners.push(listener);
      }
      else{
        this._listeners[type] = [listener];
      }
      return this;
    };
    SerialFileReader.prototype.emit = function(type, data){
      var self = this;
      self._listeners[type].forEach(function(fn){
        fn.call(self, data);
      });
    };
    return SerialFileReader;
  })