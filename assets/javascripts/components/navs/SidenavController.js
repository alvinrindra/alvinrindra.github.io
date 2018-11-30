define([
    'angular',
], function(angular) {
    'use strict';
    /**
     * viewer module:
     */
    angular.module('autolinks.sidenav', []);
    angular.module('autolinks.sidenav')
        // Viewer Controller
        .controller('SidenavController', ['$scope', '$rootScope', '$timeout', '$mdSidenav', '$mdDialog','$log', 'EntityService', 'EndPointService', '_',
        function ($scope, $rootScope, $timeout, $mdSidenav, $mdDialog, $log, EntityService, EndPointService, _) {

          $scope.label = '';
          $scope.metadata = {};

          $scope.init = function() {
            // $timeout( function() {
              $scope.selectedEntity = EntityService.getRootScopeEntity();
              $scope.tempEnt = _.clone($scope.selectedEntity);
              var entity = $scope.selectedEntity;
              if (entity._private) {
                $scope.label = entity._private.data.name;
              }
              console.log($scope.selectedEntity);
              // console.log($scope);
            // }, 1000);
          }

          $rootScope.$on('sidenavReinit', function (event, args) {
            $scope.init();
            $mdSidenav('right').open();
          });

          $scope.init();
          // $scope.selectedEntity = EntityService.getRootScopeEntity();
          // console.log(selectedEntity);

          // // add Edges to the edges object, then broadcast the change event
          $scope.update = function() {
              const entity = $scope.selectedEntity;
              const label = $scope.label;

              // const before = {
              //   "rid": entity.data('rid'),
              //   "cid": entity.data('cid'),
              //   "metadata": entity.data('metadata') ? entity.data('metadata') : {},
              //   "value": entity.data('value') ? entity.data('value') : {}
              // };
              // const after = {
              //   "rid": entity.data('rid'),
              //   "cid": entity.data('cid'),
              //   "metadata": $scope.selectedEntity.data().name ? { label: $scope.selectedEntity.data().name } : {},
              //   "value": entity.data('value') ? entity.data('value') : {}
              // };
              // const data = { before: before, after: after};
              // EndPointService.editResource(data);

              // $scope.selectedEntity = EntityService.updateRootScopeEntity($scope.selectedEntity);
              // // broadcasting the event
              // // $rootScope.$broadcast('appChanged');
              $mdSidenav('right').close();
              cy.$(":selected").data('name', $scope.selectedEntity.data().name);
          };

          $scope.createCompound = function(){
              $rootScope.$emit('createCompound');
              $mdSidenav('right').close();
          };

          $scope.delete = function(ev) {
              const entity = $scope.selectedEntity;
              const label = $scope.label;
              var entName = entity.data('metadata') && entity.data('metadata').label ?  entity.data('metadata').label : entity.data('name');

              var confirm = $mdDialog.confirm()
                   .title('Are you sure to delete ' + entName + ' node ?')
                   .targetEvent(ev)
                   .ok('Yes, delete it!')
                   .cancel('Cancel');

              $mdDialog.show(confirm).then(function() {
                // if (entity.data('rid')) {
                //   const before = {
                //     "rid": entity.data('rid'),
                //     "cid": entity.data('cid'),
                //     "metadata": $scope.metadata ? $scope.metadata : {},
                //     "value": entity.data('name') ? entity.data('name') : {}
                //   };
                //
                //   const data = { before: before, after: null };
                //   EndPointService.editResource(data);
                // }
                EntityService.deleteEntity();
                $mdSidenav('right').close();
              }, function() {
               // cancel function
              });

          };


          $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            // $route.reload();
            // $scope.selectedEntity = $scope.temp;
            EndPointService.fetchData();
            $mdSidenav('right').close()
              .then(function () {
                $log.debug("close RIGHT is done");
              });

            cy.$(":selected").data('name', $scope.selectedEntity.data().name);
          };

        }
      ]);
});
