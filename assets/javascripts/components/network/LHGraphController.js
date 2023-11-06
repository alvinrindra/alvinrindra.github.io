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
        .controller('LHGraphController', ['$scope', '$q', '$rootScope', 'graphProperties', 'EntityService', '_', '$mdDialog', '$mdToast', '$timeout',
        function ($scope, $q, $rootScope, graphProperties, EntityService, _, $mdDialog, $mdToast, $timeout) {

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

          $scope.$mdDialog = $mdDialog;
          $scope.$mdToast = $mdToast;

          $scope.edgehandler = false;
          // container objects
          $scope.mapData = [];
          $scope.edgeData = [];
          // data types/groups object - used Cytoscape's shapes just to make it more clear
          $scope.objTypes = ['ellipse','triangle','rectangle','roundrectangle','pentagon','octagon','hexagon','heptagon','star'];


          $scope.buildGraph = function() {

              var promise = $q.defer();

              var nodes = [
                //alvinrindra
                // { data: { id: 'alvinrindra', name: 'alvinrindra', desc: "Data Scientist; Senior AI & Data Consultant @ Lufthansa", image: "https://alvinrindra.github.io/assets/images/Alvinfoto2.jpg" } },
                //storages
                { data: { id: 'azurecloud', name: "Azure Cloud" } },
                { data: { id: 'subscription', name: "Subscription", parent:"azurecloud", image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/general/10002-icon-service-Subscriptions.svg" } },
                { data: { id: 'resourcegroup', name: "Resource Group", parent: "azurecloud" } },
                { data: { id: 'rg', name: ".....-rg", parent:"azurecloud", image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/general/10007-icon-service-Resource-Groups.svg" } },
                { data: { id: 'keyvault', name: "KeyVault", parent: 'resourcegroup', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/security/10245-icon-service-Key-Vaults.svg" } },
                { data: { id: 'endpoint', name: "Endpoint", parent: 'resourcegroup', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/other/02579-icon-service-Private-Endpoints.svg" } },
                { data: { id: 'aad', name: "Active Directory", parent: 'azurecloud', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/security/03343-icon-service-Azure-AD-Authentication-Methods.svg" } },
                { data: { id: 'adevops', name: "Azure Devops", parent: 'azurecloud', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/devops/10261-icon-service-Azure-DevOps.svg" } },
                { data: { id: "azure", name: "Azure", parent: 'azurecloud', image: "https://alvinrindra.github.io/assets/images/data_science/azure.png"  } },
                { data: { id: 'storage', name: "Data Estate", parent: 'resourcegroup' } },
                
                
                // { data: { id: 'lead_data', name: "Lead Data Science", parent: 'storage', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/ai_ml/00028-icon-service-Batch-AI.svg", desc: "" }},
                { data: { id: 'iot_devices', name: "IoT Devices & Event Sources" } },
                { data: { id: 'wind_turbine', name: "Wind Turbine", parent: 'iot_devices', image: "https://static.thenounproject.com/png/649875-200.png", desc: "" }},
                { data: { id: 'weather_data', name: "Weather Data", parent: 'iot_devices', desc: "" }},
                { data: { id: 'adls', name: "ADLS Gen2", parent: 'storage', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/analytics/10150-icon-service-Data-Lake-Store-Gen1.svg", desc: "" } },
                { data: { id: 'blob', name: "Storage Blob", parent: 'storage', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/general/10780-icon-service-Blob-Block.svg", desc: "" } },
                { data: { id: 'onpremise', name: "On Premise / Maintenance Data", desc: "" } },
                { data: { id: 'historical records', name: "Historical records", desc: "" } },
                { data: { id: 'oracle', name: "Oracle", parent: 'onpremise', desc: "" } },
                // { data: { id: 'database', name: "Database", parent: 'be_stack' } },
                { data: { id: 'mongodb', name: "MongoDB", parent: 'onpremise', image: "https://alvinrindra.github.io/assets/images/programming/mongodb.png" } },
                { data: { id: 'mysql', name: "MySQL", parent: 'onpremise', image: "https://alvinrindra.github.io/assets/images/programming/mysql.png" } },
                { data: { id: 'postgre', name: "Postgre", parent: 'onpremise', image: "https://alvinrindra.github.io/assets/images/programming/postgresql.png" } },

                //event_queueing
                { data: { id: 'data_integration', name: "Data Integration", parent: 'resourcegroup'} },
                { data: { id: 'azure_synapse', name: "Azure Synapse", parent: 'data_integration', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/analytics/00606-icon-service-Azure-Synapse-Analytics.svg", desc: "" } },
                // { data: { id: 'event_hub', name: "Event Hub", parent: 'data_integration', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/iot/00039-icon-service-Event-Hubs.svg", desc: "" } },


                //event_queueing
                { data: { id: 'event_queueing', name: "Event Queueing and Stream Ingestion", parent: 'resourcegroup'} },
                { data: { id: 'uin_jkt', name: "IoT Hub", parent: 'event_queueing', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/iot/10182-icon-service-IoT-Hub.svg", desc: "" } },
                { data: { id: 'event_hub', name: "Event Hub", parent: 'event_queueing', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/iot/00039-icon-service-Event-Hubs.svg", desc: "" } },

               // Technology Stack
                { data: { id: 'stream_analytics', name: "Stream Analytics", parent: 'resourcegroup' }},

                { data: { id: 'angularjs', name: "Stream Analytics", parent: 'stream_analytics', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/iot/00042-icon-service-Stream-Analytics-Jobs.svg" } },
                { data: { id: 'mlops', name: "MLOps Workflow", parent: 'stream_analytics' } },
                { data: { id: 'azure_ml', name: "Azure ML", parent: 'mlops', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/ai_ml/10166-icon-service-Machine-Learning.svg" } },
                { data: { id: 'aks', name: "AKS", parent: 'mlops', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/containers/10023-icon-service-Kubernetes-Services.svg" } },
                { data: { id: 'azure_monitor', name: "Azure Monitor", parent: 'mlops', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/monitor/00001-icon-service-Monitor.svg" } },
                { data: { id: 'event_grid', name: "Event Grid", parent: 'mlops', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/integration/10206-icon-service-Event-Grid-Topics.svg" } },

                // Deliver
                { data: { id: 'presentation_applications', name: "Presentation & Applications", parent: 'resourcegroup' } },

                { data: { id: 'powerbi', name: "Power BI", parent: 'presentation_applications', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/analytics/03332-icon-service-Power-BI-Embedded.svg" } },
                { data: { id: 'azure_function', name: "Azure Function", parent: 'presentation_applications', image: "https://alvinrindra.github.io/assets/images/Azure_Public_Service_Icons/Icons/iot/10029-icon-service-Function-Apps.svg" } },
              ];

              $scope.nodes = nodes;
              var edges = [
          
                { data: { id: 'onpremisedata_integration', source: 'onpremise', target: 'data_integration', name: 'ingests' } },
                { data: { id: 'data_integrationstorage', source: 'data_integration', target: 'storage', name: 'stores' } },
                { data: { id: 'event_queueingstorage', source: 'angularjs', target: 'storage', name: 'stores' } },
                { data: { id: 'iot_devicesevent_queueing', source: 'iot_devices', target: 'event_queueing', name: 'ingests' } },
                { data: { id: 'alvinrindraevent_queueing', source: 'alvinrindra', target: 'event_queueing', name: 'studies' } },
                { data: { id: 'alvinrindrastream_analytics', source: 'event_queueing', target: 'stream_analytics', name: 'analyze' } },
                { data: { id: 'alvinrindrapublications', source: 'stream_analytics', target: 'presentation_applications', name: 'delivers' } },
                // { data: { id: 'alvinrindradata_science', source: 'alvinrindra', target: 'data_science_stack', name: 'has' } },
                // { data: { id: 'alvinrindraactivities', source: 'alvinrindra', target: 'interests', name: 'has' } },
                // { data: { id: 'alvinrindralanguages', source: 'alvinrindra', target: 'languages', name: 'speaks' } },
                // { data: { id: 'alvinrindraprojects', source: 'alvinrindra', target: 'projects', name: 'develops' } },

                { data: { id: 'associate_developerfull_stack_developer', source: 'associate_developer', target: 'full_stack_developer', name: 'to' } },
                // { data: { id: 'full_stack_developer_3full_stack_developer_2', source: 'full_stack_developer_3', target: 'full_stack_developer_2', name: 'to' } },
                // { data: { id: 'full_stack_developer_2full_stack_developer_1', source: 'full_stack_developer_2', target: 'full_stack_developer_1', name: 'to' } },
                { data: { id: 'full_stack_developerresearch_assistant', source: 'full_stack_developer', target: 'research_assistant', name: 'to' } },
                { data: { id: 'research_assistantdata_scientist', source: 'research_assistant', target: 'data_scientist', name: 'to' } },
                { data: { id: 'data_scientistai_specialist', source: 'data_scientist', target: 'ai_specialist', name: 'to' } },
                { data: { id: 'data_scientistlead_data', source: 'data_scientist', target: 'lead_data', name: 'to' } },
                // { data: { id: 'nndeeplearning', source: 'nn', target: 'deep_learning', name: 'aka' } },
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

                  if(n.data.url){
                    result['data'].url = n.data.url;
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
                $timeout( function() {
                  $scope.progressBarIsInactive = true;
                  $rootScope.$emit('progressBarIsInactive');
                }, 1000);
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
