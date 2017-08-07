var width="960"
var height="600"


var svg = d3.select("#forcegraph")
    .attr("width", width)
    .attr("height", height);

//var color = d3.scaleOrdinal(d3.schemeCategory20);

var colors = d3.scaleOrdinal()
    .domain(['1','2','3', '4', '5', '6','7','8','9'])
    .range(['red', 'orange', 'blue', 'green', 'yellow', 'white', 'lime', 'black', 'navy' ])

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))

    .force("charge", d3.forceManyBody().strength(-50))
    .force("nodes", d3.forceCollide())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d){return 5*Math.sqrt(d.count/Math.PI);}))
    //.force('gravity',0.05)
  //  .gravity(0.05)
    ;

d3.json("forcegraph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("stroke-width",function(d){return (d.value>50) ? (d.value/20):(0)})

      ;


  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    //.attr("r",5)
      .attr("r", function(d){return (d.count>200) ? (Math.sqrt(d.count/Math.PI)):(0);})
      .attr("fill", function(d) {
        console.log("colore: ",colors, d.group)
       // return color(d.group); })
       return colors(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
      ;



  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links)
      ;

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
