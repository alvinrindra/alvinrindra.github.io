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
        .controller('AIAutomationGraphController', ['$scope', '$q', '$rootScope', 'graphProperties', 'EntityService', '_', '$mdDialog', '$mdToast', '$timeout',
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
                { data: { id: 'alvinrindra', name: 'alvinrindra', desc: "Data Scientist; Senior AI & Data Consultant @ Lufthansa", image: "https://alvinrindra.github.io/assets/images/Alvinfoto2.jpg" } },
                // Technology Stack
                { data: { id: 'tech_stack', name: "AI Automation Topic Milestones (WIP)" } },
                { data: { id: 'fe_stack', name: "Vision", parent: "tech_stack" } },
                { data: { id: 'fe_2025', name: "2025", parent: "tech_stack" } },
                { data: { id: 'T2', name: "T2", parent: "fe_2025" } },
                { data: { id: 'T1', name: "T1", parent: "fe_2025" } },

                { data: { id: 'fe_2024', name: "2024", parent: "tech_stack" } },
                { data: { id: 'T124', name: "T1", parent: "fe_2024" } },

                // { data: { id: 'ui_frameworks', name: "UI Frameworks", parent: 'fe_stack' } },
                // { data: { id: 'angularjs', name: "Angular", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/angular.png" } },
                // { data: { id: 'streamlit', name: "Streamlit", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/streamlit.png" } },
                // { data: { id: 'reactjs', name: "React", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/react.png" } },
                // { data: { id: 'meteor', name: "Meteor", parent: 'ui_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/meteor.png" } },

                // { data: { id: 'fe_build_tools', name: "Build Tools", parent: 'fe_stack' } },
                // { data: { id: 'webpack', name: "Webpack", parent: 'fe_build_tools', image: "https://alvinrindra.github.io/assets/images/programming/webpack.png" } },

                // { data: { id: 'package_managers', name: "Package Managers", parent: 'fe_stack' } },
                // { data: { id: 'npm', name: "npm", parent: 'package_managers', image: "https://alvinrindra.github.io/assets/images/programming/npm.png"} },
                // { data: { id: 'bower', name: "Bower", parent: 'package_managers', image: "https://alvinrindra.github.io/assets/images/programming/bower.jpeg"} },

                // { data: { id: 'be_stack', name: "Back-End Stack", parent: "tech_stack" } },
                // { data: { id: 'database', name: "Database", parent: 'be_stack' } },
                // { data: { id: 'mongodb', name: "MongoDB", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/mongodb.png" } },
                // { data: { id: 'mysql', name: "MySQL", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/mysql.png" } },
                // { data: { id: 'postgre', name: "Postgre", parent: 'database', image: "https://alvinrindra.github.io/assets/images/programming/postgresql.png" } },


                // { data: { id: 'cloud', name: "Cloud", parent: "tech_stack" } },
                // { data: { id: 'aws', name: "AWS", parent: 'cloud', image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/200px-Amazon_Web_Services_Logo.svg.png" } },
                // { data: { id: "gcp", name: "GCP", parent: 'cloud', image: "https://alvinrindra.github.io/assets/images/data_science/gcp.png"  } },
                // { data: { id: "azure", name: "Azure", parent: 'cloud', image: "https://alvinrindra.github.io/assets/images/data_science/azure.png"  } },

                // { data: { id: 'programming_languages', name: "Programming Languages", parent: 'be_stack' } },
                // { data: { id: 'ruby', name: "Ruby", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/ruby.png" } },
                // { data: { id: 'scala', name: "Scala", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/scala.png" } },
                // { data: { id: 'python', name: "Python", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/python.png" } },
                // { data: { id: 'java', name: "Java", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/java.png" } },
                // { data: { id: 'nodejs', name: "NodeJs", parent: 'programming_languages', image: "https://alvinrindra.github.io/assets/images/programming/nodejs.png" } },

                // { data: { id: 'be_frameworks', name: "Frameworks", parent: 'be_stack' } },
                // { data: { id: 'fastapi', name: "FastAPI", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/fastapi.png"} },
                // { data: { id: 'ror', name: "Ruby on Rails", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/ROR.png"} },
                // { data: { id: 'meteor_be', name: "Meteor", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/meteor.png"} },
                // { data: { id: 'scala_play', name: "Scala Play", parent: 'be_frameworks', image: "https://alvinrindra.github.io/assets/images/programming/scala-play.png"} },

                // { data: { id: 'be_build_tools', name: "Build Tools", parent: 'be_stack' } },
                // { data: { id: 'maven', name: "Maven", parent: 'be_build_tools', image: "https://alvinrindra.github.io/assets/images/programming/maven.png"} },
                // { data: { id: 'scala_sbt', name: "Scala Sbt", parent: 'be_build_tools', image: "https://alvinrindra.github.io/assets/images/programming/scala-sbt.png"} },

                // { data: { id: 'api', name: "API", parent: 'be_stack' } },
                // { data: { id: 'swagger', name: "Swagger", parent: 'api', image: "https://alvinrindra.github.io/assets/images/programming/Swagger.png"} },
                // // { data: { id: 'ide', name: "IDE", parent: 'tech_stack' } },
                // // { data: { id: 'atom', name: "Atom", parent: 'ide', image: "https://alvinrindra.github.io/assets/images/programming/atom.png" } },
                // // { data: { id: 'intellij', name: "IntelliJ", parent: 'ide', image: "https://alvinrindra.github.io/assets/images/programming/intellij.jpeg" } },
                // { data: { id: 'data_visualization', name: "Data Visualization", parent: 'tech_stack' } },
                // { data: { id: 'd3', name: "D3", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/d3js.png"} },
                // { data: { id: 'vis', name: "VisJs", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/visjs.png"} },
                // { data: { id: 'cytoscape', name: "CytoscapeJS", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/cytoscape.svg"} },
                // { data: { id: 'plotly', name: "Plotly", parent: 'data_visualization', image: "https://alvinrindra.github.io/assets/images/programming/plotly.png"} },

                // { data: { id: 'devops', name: "DevOps", parent: 'tech_stack' } },
                // { data: { id: 'docker', name: "Docker", parent: 'devops', image: "https://alvinrindra.github.io/assets/images/programming/docker.png" } },
                // { data: { id: 'helm', name: "HELM", parent: 'devops', image: "https://alvinrindra.github.io/assets/images/programming/helm.png" } },
                // { data: { id: 'kubernetes', name: "Kubernetes", parent: 'devops', image: "https://alvinrindra.github.io/assets/images/programming/kubernetes.png" } },
                // { data: { id: 'terraform', name: "Terraform", parent: 'devops', image: "https://alvinrindra.github.io/assets/images/programming/terraform.png" } },

                // { data: { id: 'indexing', name: "Indexing", parent: 'tech_stack' } },
                // { data: { id: 'elasticsearch', name: "Elasticsearch", parent: 'indexing', image: "https://alvinrindra.github.io/assets/images/programming/elasticsearch.jpg" } },
                // { data: { id: 'solr', name: "Solr", parent: 'indexing', image: "https://alvinrindra.github.io/assets/images/programming/solr.png"} },

                // Data Science Stack
                { data: { id: 'data_science_stack', name: "AI Automation Stack" } },


                { data: { id: 'e2e', name: "Automation/RPA", parent: 'data_science_stack' } },
                { data: { id: 'e2e_todo', name: "TODO", parent: 'e2e' } },
                { data: { id: 'e2e_open', name: "Open Source", parent: 'e2e_todo' } },
                { data: { id: 'e2e_enterprise', name: "Enterprise", parent: 'e2e_todo' } },
                { data: { id: 'robocorp', name: "Robocorp", parent: 'e2e_open', image: "https://alvinrindra.github.io/assets/images/automation/robocorp.png" } },
                { data: { id: 'skyvern', name: "Robotframework", parent: 'e2e_open', image: "https://alvinrindra.github.io/assets/images/automation/robotframework.png"} },
                
                { data: { id: 'uipath', name: "UIPath", parent: 'e2e_enterprise', image: "https://alvinrindra.github.io/assets/images/automation/uipath.png" } },
                { data: { id: 'automationanywhere', name: "Automation Anywhere", parent: 'e2e_enterprise', image: "https://alvinrindra.github.io/assets/images/automation/automationanywhere.png"} },
                
                
                { data: { id: 'selenium', name: "Selenium", parent: 'e2e', image: "https://alvinrindra.github.io/assets/images/programming/selenium.png" } },
                { data: { id: 'nightwatch', name: "Nightwatch", parent: 'e2e', image: "https://alvinrindra.github.io/assets/images/programming/nightwatch.png"} },

 
                { data: { id: "nlp", name: "Natural Language Processing", parent: 'data_science_stack'  } },
                { data: { id: 'uima', name: "UIMA", parent: 'nlp', image: "https://alvinrindra.github.io/assets/images/data_science/uima.png" } },
                { data: { id: 'nltk', name: "NLTK", parent: 'nlp' } },
                { data: { id: 'spacy', name: "SpaCy", parent: 'nlp' } },
                { data: { id: 'ctakes', name: "cTakes", parent: 'nlp', image: "https://alvinrindra.github.io/assets/images/programming/ctakes.png" } },

                { data: { id: "genai", name: "GenAI/LLMOPS", parent: 'data_science_stack'  } },
                { data: { id: 'llm', name: "LLM", parent: 'genai'} },
                { data: { id: 'openai', name: "OpenAI-GPT4", parent: 'llm', image: "https://alvinrindra.github.io/assets/images/genai/openai.png" } },
                { data: { id: 'meta', name: "Meta-LLama2", parent: 'llm', image: "https://alvinrindra.github.io/assets/images/genai/meta.png" } },
                { data: { id: 'vectorstore', name: "Vectorstore", parent: 'genai' } },
                { data: { id: 'elasticvect', name: "Elasticsearch", parent: 'vectorstore', image: "https://alvinrindra.github.io/assets/images/genai/elastic.png" } },
                { data: { id: 'milvus', name: "Milvus", parent: 'vectorstore', image: "https://alvinrindra.github.io/assets/images/genai/milvus.png" } },
                // { data: { id: 'chroma', name: "Chroma", parent: 'vectorstore', image: "https://alvinrindra.github.io/assets/images/genai/chroma.png" } },
                { data: { id: 'frameworks', name: "GenAI Frameworks", parent: 'genai' } },
                { data: { id: 'langchain', name: "Langchain", parent: 'frameworks', image: "https://alvinrindra.github.io/assets/images/genai/langchain.png" } },
                { data: { id: 'haystack', name: "Haystack", parent: 'frameworks', image: "https://alvinrindra.github.io/assets/images/genai/haystack.png" } },
                { data: { id: 'dep_mon', name: "LLM Evaluation", parent: 'genai' } },
                { data: { id: 'mlflow_2', name: "MLFlow", parent: 'dep_mon', image: "https://alvinrindra.github.io/assets/images/data_science/mlflow.png" } },
                { data: { id: 'prompt_eng', name: "Prompt Engineering", parent: 'genai' } },
                { data: { id: 'promptflow', name: "prompflow", parent: 'prompt_eng', image: "https://alvinrindra.github.io/assets/images/genai/promptflow.png" } },
                // { data: { id: 'llm_deployment', name: "Deployment", parent: 'genai' } },
                // { data: { id: 'ollama', name: "Ollama", parent: 'llm', image: "https://alvinrindra.github.io/assets/images/genai/ollama.png" } },

                // { data: { id: "big_data", name: "Big Data", parent: 'data_science_stack'  } },

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
                { data: { id: 'alvinrindratech_stack', source: 'alvinrindra', target: 'tech_stack', name: 'leads' } },
                { data: { id: 'alvinrindrapublications', source: 'alvinrindra', target: 'publications', name: 'writes' } },
                { data: { id: 'alvinrindradata_science', source: 'alvinrindra', target: 'data_science_stack', name: 'has' } },
                { data: { id: 'alvinrindraactivities', source: 'alvinrindra', target: 'interests', name: 'has' } },
                { data: { id: 'alvinrindralanguages', source: 'alvinrindra', target: 'languages', name: 'speaks' } },
                { data: { id: 'alvinrindraprojects', source: 'alvinrindra', target: 'projects', name: 'develops' } },

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
