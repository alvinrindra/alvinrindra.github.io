define([
    'angular',
    'jquery',
    'cola',
    'cytoscape',
    'cytoscape-cose-bilkent',
    'cytoscape-cxtmenu',
    'cytoscape-panzoom',
    'cytoscape-qtip',
    'cytoscape-expand-collapse',
    'cytoscape-edgehandles',
    'cytoscape.js-undo-redo',
    'qtip2',
    'bootstrap',
], function(angular, $, cola, cytoscape, regCose, cxtmenu, panzoom, cyqtip, expandCollapse,edgehandles, undoRedo, qtip2) {
    'use strict';

    angular.module('ngCy', [])

    .directive('cytoscape', function($rootScope) {
        // graph visualisation by - https://github.com/cytoscape/cytoscape.js
        return {
            restrict: 'EA',
            template :'<div id="cy-network"></div>',
            replace: true,
            scope: {
                // data objects to be passed as an attributes - for nodes and edges
                data: '=',
                cyData: '=',
                cyEdges: '=',
                options: '=',
                // controller function to be triggered when clicking on a node
                cyClick:'&',
                events: '='
            },
            link: function(scope, element, attrs, fn) {
                var networkEvents = [
                    'tap'
                ];
                // dictionary of colors by types. Just to show some design options
                scope.typeColors = {
                    'ellipse':'#992222',
                    'triangle':'#222299',
                    'rectangle':'#661199',
                    'roundrectangle':'#772244',
                    'pentagon':'#990088',
                    'hexagon':'#229988',
                    'heptagon':'#118844',
                    'octagon':'#335577',
                    'star':'#113355'
                };

                var cy = null;

                panzoom(cytoscape, $);
                expandCollapse(cytoscape, $);
                undoRedo(cytoscape);
                regCose(cytoscape);
                cyqtip(cytoscape, $);
                cxtmenu(cytoscape);
                edgehandles(cytoscape);

                scope.$watch('data', function () {

                    // Sanity check
                    if (scope.data == null) {
                        return;
                    }

                    // If we've actually changed the data set, then recreate the graph
                    // We can always update the data by adding more data to the existing data set
                    if (cy != null) {
                        cy.destroy();
                    }

                    // edgehandles(cytoscape);

                    var domContainer = document.getElementById('cy-network');
                    console.log(scope.data);
                    // graph  build
                    scope.doCy = function(){ // will be triggered on an event broadcast
                      // parse edges
                      // you can build a complete object in the controller and pass it without rebuilding it in the directive.
                      // doing it like that allows you to add options, design or what needed to the objects
                      // doing it like that is also good if your data object/s has a different structure

                      for (var i=0; i<scope.cyEdges.length; i++)
                      {
                          // get edge source
                          var eSource = scope.cyEdges[i].source;
                          // get edge target
                          var eTarget = scope.cyEdges[i].target;
                          // get edge id
                          var eId = scope.cyEdges[i].id;
                          // build the edge object
                          var edgeObj = {
                              data:{
                                id:eId,
                                source:eSource,
                                target:eTarget
                              }
                          };
                          // adding the edge object to the edges array
                          scope.data.edges.push(edgeObj);
                      }

                      // parse data and create the Nodes array
                      // object type - is the object's group
                      for (var i=0; i<scope.cyData.length; i++)
                      {
                          // get id, name and type  from the object
                          var dId = scope.cyData[i].id;
                          var dName = scope.cyData[i].name;
                          var dType = scope.cyData[i].type;
                          // get color from the object-color dictionary

                          var typeColor = scope.typeColors[dType];
                          // build the object, add or change properties as you need - just have a name and id
                          var elementObj = {
                              // group:dType,
                              'data':{
                                  id:dId,
                                  name:dName,
                                  typeColor:typeColor,
                                  typeShape:dType,
                                  type:dType,

                          }};
                          // add new object to the Nodes array
                          scope.data.nodes.push(elementObj);
                      }

                      cy = window.cy = cytoscape({
                            container: domContainer,
                            layout: scope.options.layout,
                            style: scope.options.style,
                            elements: scope.data
                      });

                      var edgeHandleProps = {
                        preview: false,
                        complete: function( sourceNode, targetNode, addedEles ){
                          // fired when edgehandles is done and elements are added
                          // build the edge object
                          // get edge source
                          if (sourceNode.data && targetNode.data) {
                            var eSource = sourceNode.data('id');
                            // get edge target
                            var eTarget = targetNode.data('id');
                            // get edge id
                            var eId = eSource + eTarget;
                            // build the edge object
                            var edgeObj = {
                                data:{
                                  id:eId,
                                  source:eSource,
                                  target:eTarget,
                                  name: 'has relation'
                                }
                            };
                            // adding the edge object to the edges array
                            scope.data.edges.push(edgeObj);
                          }
                          this.enabled = false;
                        },
                      }

                      var eh = cy.edgehandles(edgeHandleProps);
                      eh.enabled = false;

                      if (scope.$parent.edgehandler) {
                        eh.enabled = true;
                        eh.start( cy.$('node:selected') );
                      }

                      // Event listeners
                      // with sample calling to the controller function as passed as an attribute
                      cy.on('tap', 'node', function(e){
                          eh.enabled = false;
                          var evtTarget = e.target;
                          var nodeId = evtTarget.id();
                          // scope.cyClick({value:nodeId});
                          // scope.$parent.EntityService.openSideNav(evtTarget);
                      });

                      scope.coordinate = {};

                      cy.on('taphold', function(e){
                          eh.enabled = false;
                          scope.coordinate = e.position;
                      });


                      cy.nodes().forEach(function(n){
                        if (n.data('image')) {
                          cy.style()
                            .selector('#'+ n.data('id'))
                            .css(
                              {
                              'background-image': n.data('image'),
                              'background-color': 'rgba(255, 255, 255, 0)',
                              'text-valign': 'bottom',
                              'width': '50',
                              'height': '50'
                              }
                            ).update();
                        }
                      });

                      cy.nodes().forEach(function(n){
                        nodeTipExtension(n);
                      });

                      function nodeTipExtension(n) {
                        scope.currentNode = {};

                        $(document).on('click', "#editNode", function(event, n){
                          scope.$parent.EntityService.openSideNav(scope.currentNode);
                        });

                        $(document).on('click', "#addEdge", function(){
                          eh.enabled = true;
                          eh.start( cy.$('node:selected') );
                        });

                        if (n.data('name') && !n.isParent()) {
                          cy.$('#'+ n.data('id')).qtip({
                            content: {
                                text: function(event, api) {
                                  scope.currentNode = n;
                                  return (
                                  '<div class="node-buttons">' +
                                  '<button id="readMode" class="node-button"><i class="fa fa-book fa-2x"/></button>' +
                                  '<button id="addEdge" class="node-button"><i class="fa fa-arrows-alt fa-2x"/></button> ' +
                                  '<button id="editNode" class="node-button"><i class="fa fa-pencil fa-2x"/></button>' +
                                  '</div>'
                                  )
                                }
                            },
                            position: {
                              my: 'bottom center',
                              at: 'top center'
                            },
                            style: {
                                name: 'qtip-content'
                            }
                          });
                        }

                        if (n.data('desc')) {
                          cy.$('#'+ n.data('id')).qtip({
                            content: {
                                text: function(event, api) {
                                  return (
                                  '<div class="node-description">' + n.data('desc') + '</div>'
                                  )
                                }
                            },
                            position: {
                              my: 'top center',
                              at: 'bottom center'
                            },
                            style: {
                              classes: 'qtip-bootstrap',
                              tip: {
                                width: 16,
                                height: 8
                              },
                            }
                          });
                        }
                      }

                      cy.expandCollapse({
                        layoutBy: {
                          name: "cose-bilkent",
                          // animate: "end",
                          randomize: false,
                          fit: true
                        },
                        fisheye: false,
                        animate: false
                      });

                        // the default values of each option are outlined below:
                        var defaults = {
                          zoomFactor: 0.05, // zoom factor per zoom tick
                          zoomDelay: 45, // how many ms between zoom ticks
                          minZoom: 0.1, // min zoom level
                          maxZoom: 10, // max zoom level
                          fitPadding: 50, // padding when fitting
                          panSpeed: 10, // how many ms in between pan ticks
                          panDistance: 10, // max pan distance per tick
                          panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
                          panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
                          panInactiveArea: 8, // radius of inactive area in pan drag box
                          panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
                          zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
                          fitSelector: undefined, // selector of elements to fit
                          animateOnFit: function(){ // whether to animate on fit
                            return false;
                          },
                          fitAnimationDuration: 1000, // duration of animation on fit

                          // icon class names
                          sliderHandleIcon: 'fa fa-minus',
                          zoomInIcon: 'fa fa-plus',
                          zoomOutIcon: 'fa fa-minus',
                          resetIcon: 'fa fa-expand'
                        };

                        cy.panzoom( defaults );


                        cy.cxtmenu({
                          selector: 'node, edge',
                          fillColor: 'rgba(95, 239, 228, 0.84)',
                          // openMenuEvents: 'tap',
                          commands: [
                            {
                              content: '<span class="fa fa-flash fa-2x"></span>',
                              select: function(ele){
                                console.log( ele.id() );
                              }
                            },

                            {
                              content: '<span class="fa fa-star fa-2x"></span>',
                              select: function(ele){
                                console.log( ele.data('name') );
                              },
                              disabled: true
                            },

                            {
                              content: 'Text',
                              select: function(ele){
                                console.log( ele.position() );
                              }
                            }
                          ]
                        });

                        cy.cxtmenu({
                        selector: 'core',
                        fillColor: 'rgba(95, 239, 228, 0.84)',
                        openMenuEvents: 'taphold',
                        commands: [
                          {
                            content: '<span class="fa fa-plus-circle fa-2x"></span>',
                            select: function(e){
                              var x = scope.coordinate.x;
                              var y = scope.coordinate.y;
                              var nodeObj = {
                                  data: {
                                    id: 'n' + scope.data.nodes.length,
                                    name: 'new'
                                  },
                                  position: {
                                    x,
                                    y
                                  }
                              };
                              scope.data.nodes.push(nodeObj);
                              var n = cy.add(nodeObj);
                              nodeTipExtension(n);
                              cy.fit();
                            }
                          },

                          {
                            content: '<span class="fa fa-flash fa-2x"></span>',
                            select: function(){
                              console.log( 'function 2' );
                            }
                          }
                        ]
                      });


                    }; // end doCy()

                  scope.doCy();

                  // Attach an event handler if defined
                  angular.forEach(scope.events, function (callback, event) {
                      if (networkEvents.indexOf(String(event)) >= 0) {
                          cy.on(event, callback);
                      }
                  });

                  // onLoad callback
                  if (scope.events != null && scope.events.onload != null &&
                      angular.isFunction(scope.events.onload)) {
                      scope.events.onload(cy);
                  }

                  // When the app object changed = redraw the graph
                  // you can use it to pass data to be added or removed from the object without redrawing it
                  // using cy.remove() / cy.add()
                  $rootScope.$on('appChanged', function(){
                      scope.doCy();
                  });

                });

            }
        };
    });
});