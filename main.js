//Initialize dataset letiable
let sampleData = undefined;
//Set margins for every graph
let margin = { top: 20, right: 20, bottom: 50, left: 40 };

//Get the svg element from graph 1
let svg = d3.select("#graph");
//Initialize x and y ranges for graph 1
let x = d3.scaleBand().padding(0.1);
let y = d3.scaleLinear();
//Initialize wrapper for graph 1
let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
g.append("g").attr("class", "xaxis");
g.append("g").attr("class","yaxis");
g.append("text").attr("class", "yname").attr("text-anchor", "end").attr("y", -5).attr("x", 5).attr("transform", "rotate(0)").text("value1");
g.append("text").attr("class", "xname").attr("text-anchor", "end").text("name");

//Get the svg element from graph 2
let svg2 = d3.select("#graph2");
//Initialize x and y ranges for graph 2
let x2 = d3.scaleBand().padding(0.1);
let y2 = d3.scaleLinear();
//Initialize wrapper for graph 2
let g2 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
g2.append("g").attr("class", "xaxis");
g2.append("g").attr("class","yaxis");
g2.append("text").attr("class", "yname").attr("text-anchor", "end").attr("y", -5).attr("x", 5).attr("transform", "rotate(0)").text("value2");
g2.append("text").attr("class", "xname").attr("text-anchor", "end").text("name");

//Function to draw/redraw the graph
function draw(svgParam,xParam,yParam,gParam) {
  //get bounds from svg and calculate width,height
  let bounds = svgParam.node().getBoundingClientRect();
  width = bounds.width - margin.left - margin.right;
  height = bounds.height - margin.top - margin.bottom;

  //set x,y ranges based on width and height
  xParam.rangeRound([0, width]);
  yParam.rangeRound([height, 0]);

  //create x axis labels
  gParam.select(".xaxis")
    .attr("transform", "translate(0," + (height+30) + ")")
    .call(d3.axisBottom(xParam));
  //create y axis labels
  gParam.select(".yaxis")
    .call(d3.axisLeft(yParam));

  //update position of the x axis name
  gParam.selectAll(".xname")
    .attr("x", width)
    .attr("y", height+20);

  //get all bars
  let bars = gParam.selectAll(".bar")
    .data(sampleData);

  //initialize the bars with x,y,width,height, and color
  bars
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return xParam(d.name); })
    .attr("y", function (d) {
      if(svgParam===svg){ return yParam(d.values.value1); }
      else if (svgParam===svg2){ return yParam(d.values.sub.value2); }
    })
    .attr("width", xParam.bandwidth())
    .attr("height", function (d) {
      if(svgParam===svg){ return (height - yParam(d.values.value1)); }
      else if (svgParam===svg2){ return (height - yParam(d.values.sub.value2)); }
    })
    .attr("fill",function(d){
      if(svgParam===svg){ return "red"; }
      else if (svgParam===svg2){ return "steelblue"; }
    });

  //initialize the numeric label above each bar
  bars
    .enter().append("text")
    .attr("class","label")
    .attr("text-anchor", "middle")
    .attr("y", function(d) {
      if(svgParam===svg){ return (yParam(d.values.value1) - 15); }
      else if (svgParam===svg2){ return (yParam(d.values.sub.value2) - 15); }
    })
    .attr("dy", ".75em")
    .text(function(d) {
      if(svgParam===svg){ return d.values.value1.toFixed(2); }
      else if (svgParam===svg2){ return d.values.sub.value2.toFixed(2); }
    });

  //update bar positions on the x axis
  bars
    .attr("x", function (d) { return xParam(d.name); })
    .attr("width", xParam.bandwidth());

  //update bar label positions on the x axis
  gParam.selectAll(".label")
    .attr("x", function(d) { return (xParam(d.name)+xParam.bandwidth()/2 ); });
}

//Function to read the json file and initialize the graph
function loadData(jsonFile) {
  //using d3's json reader
  d3.json(jsonFile, function (data) {
      //ensure that json fields values.value1 and values.sub.value2 are all numeric
      data.forEach(function(d) {
          d.values.value1 = +d.values.value1;
          d.values.sub.value2 = +d.values.sub.value2;
      });
    //set global data field
    sampleData=data;

    //update ranges for graph 1 and initialize graph 1
    x.domain(sampleData.map(function (data) { return data.name; }));
    y.domain([0, d3.max(sampleData, function (data) { return data.values.value1; })]);
    draw(svg,x,y,g);

    //update ranges for graph 2 and initialize graph 2
    x2.domain(sampleData.map(function (data) { return data.name; }));
    y2.domain([0, d3.max(sampleData, function (data) { return data.values.sub.value2; })]);
    draw(svg2,x2,y2,g2);
  });
}

//get the json data from sampleData.json and initialize the graph
loadData("sampleData.json");
//add an event listener to resize both graphs when the window's size changes
window.addEventListener("resize", function(){
  draw(svg,x,y,g);
  draw(svg2,x2,y2,g2);
});
