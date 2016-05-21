angular.module('App').factory('ChunkReader', ['$q', '$timeout',
  function($q, $timeout){
    return function ChunkReader(file){
      var offset = 0, CHUNKSIZE = 255* 1024,
      chunksCount = Math.ceil(file.size/CHUNKSIZE), index = 0,
      progress = 0, reader = new FileReader(),
      deferred;

      reader.onload = function(evt) {
        offset += CHUNKSIZE;

        deferred.resolve({
          data: evt.target.result,
          index: index
        });
        progress =  (index++/chunksCount)*100;
      };
      reader.onerror = function(e){
        deferred.reject(e);
      };

      return {
        next: function(){
          deferred = $q.defer();
          if (offset >= file.size) {
            return $timeout(function(){
              deferred.resolve(null);
            },0, false);
          } else{
            var slice = file.slice(offset, offset + CHUNKSIZE);
            reader.readAsArrayBuffer(slice);
          }

          return deferred.promise;
        },
        getProgress: function (){
          return progress;
        },
        getFile: function(){
          return file;
        }
      };
    };
  }]);
