
angular.module( 'App')
  .controller("mainCtrl", ['$scope', '$timeout', 'Socket', 'UploadService', 'Message',
  function($scope, $timeout, Socket, UploadService, Message){
    var socket, uploadService;

    function init(){
      $scope.messages = Message.query();
      $scope.uploads = [];
      socket = Socket.getSocket();
      uploadService = new UploadService(socket);
    }

    // FILE UPLOAD
    $scope.clickHiddenFile = function(){
      $timeout(function(){
        document.getElementsByName('file')[0].click();
      });
    };

    $scope.$watch('file', function (file) {
      if(file)
        $scope.upload(file);
    });

    // received a new message
    $scope.$on('message.new', function(event, message){
      $scope.messages = $scope.messages.concat(message);
      //removing upload progress if there is any

      var uploader = $scope.uploads.filter(function(upload){
        return upload.getFileId() === message.id;
      })
      if(uploader.length)
        $scope.uploads.splice($scope.uploads.indexOf(uploader[0]),1);
    });

    $scope.upload = function(file){
      var uploader = uploadService.upload(file);
      $scope.uploads.push(uploader);
    };

    $scope.cancelUpload = function(uploader){
      if($scope.uploads.indexOf(uploader) > -1){
        uploader.cancel();
        $scope.uploads.splice($scope.uploads.indexOf(uploader), 1);
      }
    };
    $scope.sort = function(message){
      return message.createdAt;
    };

    init();

  }]);