          var myApp = angular.module("myApp", []);
          

            myApp.controller('mainController', ['$scope', 'mainService',
                  function mainController($scope, valueService) {
                      $scope.mainModel = {
                          url: ""
                      };
                      var vm = this;
                      
                      vm.values = [];
                    
                      //gets results from factory
                      vm.getvalues = function() {
                          valueService.getvalues($scope.mainModel.url)
                              .then(function(values) {
                              vm.values = values;
                              console.log('values returned to controller.');
                              populateChart(values)
                              },
                              function(data) {
                                  console.log('values retrieval failed.')
                              });
                      }

                       $scope.search = function(){
                            vm.getvalues();
                      } 
                  
                  function populateChart(jsonResponse){
                  d3.selectAll("svg > *").remove();
                  var data = jsonResponse.slice();
                  var margin = {top: 20, right: 40, bottom: 70, left: 40},
                      width = 1300 - margin.left - margin.right,
                      height = 500 - margin.top - margin.bottom, 
                      brushYearStart = 1848,
                      brushYearEnd = 1905;

                  //spaces between each bar
                  var x = d3.scale.ordinal().rangeRoundBands([0, width], .07);

                  var y = d3.scale.linear().range([height, 0]);

                  //axis
                  var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

                  var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .ticks(10);

                  //change to var svg = d3.select("svg") var svg = d3.select("body").append("svg")
                  var zoom = d3.behavior.zoom().on('zoom', zoomed);
                  var svg = d3.select("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .attr("class", "canvas")
                      .append("g")
                      .append("g")
                      .on('mousedown.zoom',null)
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .call(zoom) //calling zoom function
                            .on("mousedown.zoom", null); //cancels zoom on mouse drag, conflicts with brush

                  x.domain(data.map(function(d) { return d.date; }));
                  y.domain([0, d3.max(data, function(d) { return d.value; })]);
                  
                  //appends the x axis
                  svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis)
                      .selectAll("text")
                      .style("text-anchor", "end")
                      .attr("dx", "-.8em")
                      .attr("dy", "-.55em")
                      .attr("transform", "rotate(-90)" );

                  //appends the y axis
                  svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Value ($)");
                  
                  
                  //add a rectangle (value) for each date
                  svg.selectAll(".bar")
                      .data(data)
                      .enter().append("rect")
                      .attr("x", function(d) { return x(d.date); })
                      .attr("width", x.rangeBand())
                      .attr("y", function(d) { return y(d.value); })
                      .attr('class', 'bar')
                      .attr("height", function(d) { return height - y(d.value); });
                  
                  // Draw the brush
                  var brush = d3.svg.brush()
                      .x(x)
                      .on("brush", brushmove)

                  //circle at the edge of brush, just a fancy tweak ;)
                  var arc = d3.svg.arc()
                      .outerRadius(height / 15)
                      .startAngle(0)
                      .endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });
                  
                  //appends circle to brush
                  var brushg = svg.append("g")
                      .attr("class", "brush")
                      .call(brush);
                                    
                  brushg.selectAll(".resize").append("path")
                      .attr("transform", "translate(0," +  height / 2 + ")")
                      .attr("d", arc);

                  brushg.selectAll("rect")
                      .attr("height", height);
                  
                  //brush function
                  function brushmove() {
                       y.domain(x.range()).range(x.domain());
                  }
                  
                  //zoom function
                  function zoomed () {
                      svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); 
                        }
                  }
                }
            ]);
          



          



