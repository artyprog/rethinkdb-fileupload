/*global io,angular*/
angular.module('App')
.factory('Socket', ['$q', '$rootScope', function($q, $rootScope){
  var socket,
    emit = io.Manager.prototype.emit;

  function connect(){
    if(socket) return socket;
    socket = io.connect();
    if (socket.onevent !== onevent) {
      socket.onevent = onevent;
    }
  }
  // override onevent
  function onevent (packet) {
    var args = packet.data || [];
    if (packet.id != null) {
      args.push(this.ack(packet.id));
    }

    if (this.connected) {
      var self = this;
      $rootScope.$apply(function(){
        emit.apply(self, args);
        emit.call(self, '*', args);
      });
    } else {
      this.receiveBuffer.push(args);
    }
  }

  connect();

  socket.once('connect', function(){
    // catch-all event listener
    socket.on('*', function(data){
      // Propagate event by $rootScope
      $rootScope.$broadcast(data[0], data[1]);
    });
  })
  .on('error', function(error){
    console.log('error', error);
  });

  return {
    getSocket: function(){
      return socket;
    },
    connect: connect
  };
}]);
