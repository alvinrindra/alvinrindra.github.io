define([
    'angular',
    'cytoscape',
    'cytoscape-edgehandles',
    'jquery',
    'ngCy'
], function(angular, cytoscape, edgehandles, $) {
    'use strict';
    /**
     * network graph module:
     * visualization and interaction of network graph
     */
    angular.module('autolinks.graph', ['ngCy']);
    angular.module('autolinks.graph')
        // Graph Controller
        .controller('GraphController', ['$scope', '$q', '$rootScope', 'graphProperties', 'EntityService',
        function ($scope, $q, $rootScope, graphProperties, EntityService) {

          var self = this;
          /* Background collection */
          self.nodes = [];
          self.edges = [];

          /* Graph collection filtered during runtime */
          self.nodesDataset = [];
          self.edgesDataset = [];

          $scope.graphOptions = graphProperties.options;

          $scope.graphEvents = {
              "onload": onNetworkLoad
          };

          function onNetworkLoad(cy) {
              self.cy = cy;
          }

          $scope.EntityService = EntityService;

          $scope.edgehandler = false;
          // container objects
          $scope.mapData = [];
          $scope.edgeData = [];
          // data types/groups object - used Cytoscape's shapes just to make it more clear
          $scope.objTypes = ['ellipse','triangle','rectangle','roundrectangle','pentagon','octagon','hexagon','heptagon','star'];


          $scope.buildGraph = function() {

              var promise = $q.defer();

              // initialize data object
              // var nodes = [
              //   { data: { id: 'a', parent: 'b', name: "Disease" }, position: { x: 215, y: 85 } },
              //   { data: { id: 'b', name: "Caucasian race" } },
              //   { data: { id: 'g', parent: 'a' } },
              //   { data: { id: 'h', parent: 'a' } },
              //   { data: { id: 'c', parent: 'b' }, position: { x: 300, y: 85 } },
              //   { data: { id: 'd', name: "Caucasian race"}, position: { x: 215, y: 175 } },
              //   { data: { id: 'e' } },
              //   { data: { id: 'f', parent: 'e' }, position: { x: 300, y: 175 } }
              // ];

              var nodes = [
                //alvinrindra
                { data: { id: 'alvinrindra', name: 'alvinrindra', desc: "also known as B lymphocytes, are a type of white blood cell of the lymphocyte subtype.", image: "https://alvinrindra.github.io/assets/images/Alvin_foto.jpg" } },
                //working_exps
                { data: { id: 'working_exp', name: "Professional Positions" } },
                { data: { id: 'research_assistant', name: "Research Assistant", parent: 'working_exp', image: "https://alvinrindra.github.io/assets/images/uni_hh.jpg" } },
                { data: { id: 'full_stack_developer_1', name: "Full Stack Developer (ROR)", parent: 'working_exp', image: "https://alvinrindra.github.io/assets/images/hausgold.png" } },
                { data: { id: 'full_stack_developer_2', name: "Full Stack Developer (ROR)", parent: 'working_exp', image: "https://alvinrindra.github.io/assets/images/converate.jpeg" } },
                { data: { id: 'full_stack_developer_3', name: "Full Stack Developer (JS)", parent: 'working_exp', image: "https://alvinrindra.github.io/assets/images/quantilope.png" } },

                { data: { id: 'associate_developer', name: "Associate Developer (BI)", parent: 'working_exp', image: "https://alvinrindra.github.io/assets/images/programming/wk.jpg" } },
                //Education
                { data: { id: 'education', name: "Education" } },
                { data: { id: 'uni_hamburg', name: "Universität Hamburg", parent: 'education', image: "https://alvinrindra.github.io/assets/images/uni_hh.jpg" } },
                { data: { id: 'uni_due', name: "Universität Duisburg-Essen", parent: 'education', image: "https://alvinrindra.github.io/assets/images/uni_due.png" } },
                // Technology Stack
                { data: { id: 'tech_stack', name: "Technology Stacks" } },

                { data: { id: 'fe_stack', name: "Front-End Stack", parent: "tech_stack" } },
                { data: { id: 'ui_frameworks', name: "UI Frameworks", parent: 'fe_stack' } },
                { data: { id: 'angularjs', name: "Angular", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/angular.png" } },
                { data: { id: 'reactjs', name: "React", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/react.png" } },
                { data: { id: 'meteor', name: "Meteor", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/meteor.png" } },

                { data: { id: 'build_tools', name: "Build Tools", parent: 'fe_stack' } },
                { data: { id: 'webpack', name: "Webpack", parent: 'build_tools' } },

                { data: { id: 'package_managers', name: "Package Managers", parent: 'fe_stack' } },
                { data: { id: 'npm', name: "npm", parent: 'package_managers'} },
                { data: { id: 'bower', name: "Bower", parent: 'package_managers'} },

                { data: { id: 'be_stack', name: "Back-End Stack", parent: "tech_stack" } },
                { data: { id: 'database', name: "Database", parent: 'be_stack' } },
                { data: { id: 'mongodb', name: "MongoDB", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/mongodb.png" } },
                { data: { id: 'mysql', name: "MySQL", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/mysql.png" } },
                { data: { id: 'postgre', name: "Postgre", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/postgresql.png" } },

                { data: { id: 'programming_languages', name: "Programming Languages", parent: 'be_stack' } },
                { data: { id: 'ruby', name: "Ruby", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/ruby.png" } },
                { data: { id: 'scala', name: "Scala", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/scala.png" } },
                { data: { id: 'python', name: "Python", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/python.png" } },
                { data: { id: 'nodejs', name: "NodeJs", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/nodejs.png" } },

                { data: { id: 'be_frameworks', name: "Frameworks", parent: 'be_stack' } },
                { data: { id: 'ror', name: "Ruby on Rails", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/ROR.png"} },
                { data: { id: 'meteor_be', name: "Meteor", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/meteor.png"} },
                { data: { id: 'sbt', name: "Sbt", parent: 'be_frameworks'} },

                { data: { id: 'api', name: "API", parent: 'be_stack' } },
                { data: { id: 'swagger', name: "Swagger", parent: 'api', image: "https://alvinrindra.github.io/assets/images/programming/Swagger.png"} },


                { data: { id: 'ide', name: "IDE", parent: 'tech_stack' } },
                { data: { id: 'atom', name: "Atom", parent: 'ide', image: "https://alvinrindra.github.io/assets/images/programming/atom.png" } },
                { data: { id: 'intellij', name: "IntelliJ", parent: 'ide'} },

                { data: { id: 'data_visualization', name: "Data Visualization", parent: 'tech_stack' } },
                { data: { id: 'd3', name: "D3", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/d3js.png"} },
                { data: { id: 'vis', name: "VisJs", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/visjs.png"} },
                { data: { id: 'cytoscape', name: "CytoscapeJS", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/cytoscape.svg"} },

                { data: { id: 'container', name: "Container", parent: 'tech_stack' } },
                { data: { id: 'docker', name: "Docker", parent: 'container', image: "https://alvinrindra.github.io/assets/images/programming/docker.png" } },

                { data: { id: 'indexing', name: "Indexing", parent: 'tech_stack' } },
                { data: { id: 'elasticsearch', name: "Elasticsearch", parent: 'indexing', image: "https://alvinrindra.github.io/assets/images/programming/elasticsearch.jpg" } },
                { data: { id: 'solr', name: "Solr", parent: 'indexing'} },
                // { data: { id: '0', parent: 'b', name: "Disease" }, position: { x: 215, y: 85 } },
                // { data: { id: '1', name: "Caucasian race" } },
                // { data: { id: '2', name: 'B_CLL', desc: "type of leukemia (a type of cancer of the white blood cells)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Chronic_lymphocytic_leukemia.jpg/1280px-Chronic_lymphocytic_leukemia.jpg" } },
                // { data: { id: '4', name: 'Antigen', parent: '8', desc: "In immunology, an antigen is a molecule capable of inducing an immune response on the part of the host organism", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Antibody.svg/255px-Antibody.svg.png" }, position: { x: 300, y: 85 } },
                // { data: { id: '5', name: "B-cell receptor", parent: '8', desc: " is a transmembrane receptor protein located on the outer surface of B cells", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bcellreceptor.svg/251px-Bcellreceptor.svg.png" }, position: { x: 215, y: 175 } },
                // { data: { id: '6', name: "V(D)J recombination" } },
                // { data: { id: '7', name: "IgVH Mutation" }, position: { x: 300, y: 175 } },
                // { data: { id: '8', name: "BCR" }, position: { x: 300, y: 175 } },

              ];

              $scope.nodes = nodes;
              var edges = [
                // { data: { id: '20', source: '2', target: '0', name: 'is-a' } },
                // { data: { id: '21', source: '2', target: '1', name: 'affects' } },
                // { data: { id: '23', source: '2', target: 'alvinrindra', name: 'affects' } },
                // { data: { id: '53', source: '5', target: 'alvinrindra', name: 'part-of' } },
                // { data: { id: '54', source: '5', target: '4', name: 'binds' } },
                // { data: { id: '76', source: '7', target: '6', name: 'causes' } },
                // { data: { id: '65', source: '6', target: '5', name: 'affects' } },

                { data: { id: 'alvinrindraworking_exp', source: 'alvinrindra', target: 'working_exp', name: 'works' } },
                { data: { id: 'alvinrindraeducation', source: 'alvinrindra', target: 'education', name: 'studies' } },
                { data: { id: 'alvinrindratech_stack', source: 'alvinrindra', target: 'tech_stack', name: 'has' } },

                { data: { id: 'associate_developerfull_stack_developer_3', source: 'associate_developer', target: 'full_stack_developer_3', name: 'to' } },
                { data: { id: 'full_stack_developer_3full_stack_developer_2', source: 'full_stack_developer_3', target: 'full_stack_developer_2', name: 'to' } },
                { data: { id: 'full_stack_developer_2full_stack_developer_1', source: 'full_stack_developer_2', target: 'full_stack_developer_1', name: 'to' } },
                { data: { id: 'full_stack_developer_1research_assistant', source: 'full_stack_developer_1', target: 'research_assistant', name: 'to' } },
              ];

              var response = {data: {entities: nodes, relations: edges}};
              // // Enable physics for new graph data when network is initialized
              // if(!_.isUndefined(self.network)) {
              //     applyPhysicsOptions(self.physicOptions);
              // }

              $scope.loading = true;

              $scope.resultNodes = response.data.entities.map(function(n) {
                  var result = {};
                  if (n.data.parent) {
                    result = { data: { id: n.data.id, parent: n.data.parent, name: n.data.name }};
                  } else {
                    result = { data: { id: n.data.id, name: n.data.name }};
                  }

                  if (n.position) {
                    result['position'] = { x: n.position.x, y: n.position.y }
                  }

                  if(n.data.image){
                    result['data'].image = n.data.image;
                  }

                  if(n.data.desc){
                    result['data'].desc = n.data.desc;
                  }

                  return result;
              });

              self.nodesDataset = [];
              self.nodesDataset.push($scope.resultNodes);

              self.nodes = [];

              $scope.resultRelations = response.data.relations.map(function(n) {
                  return {  data: { id: n.data.id, source: n.data.source, target: n.data.target, name: n.data.name } };
              });

              self.edges = [];
              self.edgesDataset = [];
              self.edgesDataset.push($scope.resultRelations);

              // Initialize the graph
              $scope.graphData = {
                  nodes: self.nodesDataset[0],
                  edges: self.edgesDataset[0]
              };
              return promise.promise;
          };

          $scope.reloadGraph = function () {
              clearGraph();
              $scope.buildGraph();
          };

          function clearGraph() {

              var promise = $q.defer();
              //
              // if(!_.isUndefined(self.network)) {
              //     applyPhysicsOptions(self.physicOptions);
              // }
              //
              // self.nodes.clear();
              // self.nodesDataset.clear();
              //
              // self.edges.clear();
              // self.edgesDataset.clear();
              //
              // // Initialize the graph
              // $scope.graphData = {
              //     nodes: self.nodesDataset,
              //     edges: self.edgesDataset
              // };

              return promise.promise;
          }

          function init() {
              $scope.reloadGraph();
          }

          // Init the network modulegit
          init();

          // add object from the form then broadcast event which triggers the directive redrawing of the chart
          // you can pass values and add them without redrawing the entire chart, but this is the simplest way
          $scope.addObj = function(){
              // collecting data from the form
              // debugger;
              var newObj = $scope.form.obj.name;
              var newObjType = $scope.form.obj.objTypes;
              // building the new Node object
              // using the array length to generate an id for the sample (you can do it any other way)
              var newNode = {id:'n'+($scope.mapData.length), name:newObj, type:newObjType};
              // adding the new Node to the nodes array
              $scope.mapData.push(newNode);
              // broadcasting the event
              $rootScope.$broadcast('appChanged');
              // resetting the form
              $scope.form.obj = {};
          };

          // add Edges to the edges object, then broadcast the change event
          $scope.addEdge = function(){
              // collecting the data from the form
              var edge1 = $scope.formEdges.fromName.id;
              var edge2 = $scope.formEdges.toName.id;
              // building the new Edge object from the data
              // using the array length to generate an id for the sample (you can do it any other way)
              var newEdge = {id:'e'+($scope.edgeData.length), source: edge1, target: edge2};
              // adding the new edge object to the adges array
              $scope.edgeData.push(newEdge);
              // broadcasting the event
              $rootScope.$broadcast('appChanged');
              // resetting the form
              $scope.formEdges = '';
          };

          // add Edges with edgehandler
          $scope.activateEdgeHandle = function(){
            $scope.edgehandler = true;
            // self.cy.edgehandles(defaults);
            $scope.reset();
          };

          $scope.disableEdgeHandle = function(){
            $scope.edgehandler = false;
            $scope.reset();
          };

          // delete a node
          $scope.delObj = function(){
            debugger;
            if (self.cy.$(":selected").length > 0) {
                self.cy.$(":selected").remove();
            }
          }

          $scope.centerGraph = function() {
            self.cy.fit();
          };

          // sample function to be called when clicking on an object in the chart
          $scope.doClick = function(value)
          {
              // sample just passes the object's ID then output it to the console and to an alert
              console.debug(value);
              alert(value);
          };

          // reset the sample nodes
          $scope.reset = function(){
              $scope.mapData = [];
              $scope.edgeData = [];
              $rootScope.$broadcast('appChanged');
          }
        }
    ]);
});
