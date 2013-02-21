(function(){
    // Service
    //
    angular.module('todoServices', ["ngResource",]).
      factory('Todo', function($resource){
        return $resource('/todos/:todoId', {todoId: "@todoId"}, {
          query: {method:'GET', isArray:true},
          update: {method:'POST'}
        })
      });


  appTodo = angular.module("appTodo", ['todoServices']);

    // Directive
    //
    appTodo.directive("todoitem", function($templateCache){
      return {
        controller: "todosController",
        restrict: "A",
        scope: {
          todo: "="
        },
        template: $templateCache.get("dotoTpl.html"),

        link: function(scope, elem, attrs) {
          scope.todo.toggleEdit = function() {
            scope.todo.edit = !scope.todo.edit;
          }

        }
      }
    });


    // Controller
    //
    appTodo.controller( "todosController", function($scope, $http, Todo) {
      $scope.filterByTodo = { done: false };
      $scope.filterByDone = { done: true };

      $scope.todos = Todo.query();

      $scope.addTodo = function() {
        if( $scope.newTodo.message.length > 0 ) {
          //this.todos.push( { message: $scope.newTodo.message, done: false } );

          //$http.post('/todos', { message: $scope.newTodo.message, done: false });
          todo = new Todo({ message: $scope.newTodo.message});
          todo.done = false;
          todo.$save();

          $scope.newTodo = {};
          $scope.todos.push( todo );
        }
      }

      $scope.toggleDone = function(todo) {
        todo.done = !todo.done;
        todo.$update();
      }

      $scope.updateTodo = function(todo){
        todo.$update();
        $scope.edit = false;
      }

      $scope.removeTodo = function(todo) {
        if( confirm("Confimer la Suppression ?") ) {
          todo.$delete();
        }
      }

    })

})();
