angular.module('App').directive('drop', function() {

  return {
    restrict: 'A',
    scope: {
      callback: '&'
    },
    link: function(scope, element, attrs) {

      element.bind('dragover', function(event){
        event.preventDefault();
        element.addClass("drag-over");
        event.dataTransfer.effectAllowed = 'copy';
        return false;
      });
      element.bind('dragleave', function(event){
        event.preventDefault();
        element.removeClass("drag-over");
        return false;
      });
      return element.bind('drop', function(event) {
        event.preventDefault();
        element.removeClass("drag-over");
        var file = event.dataTransfer.files[0];
        return scope.$apply(function() {
          scope.callback({file: file});
        });
      });
    }
  };
});
