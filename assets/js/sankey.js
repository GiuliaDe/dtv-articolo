//var widthSan = 700;
var   heightSan = 500;

var widthSan = parseInt(d3.select('#sankey_all').style('width'),10);
   // heightSan = parseInt(d3.select('#sankey_all').style('height'),10);


var svgSan = d3.select("#sankey_all")
    .append("svg")
    .attr("width", widthSan)
    .attr("height", heightSan);
    //width = +svg.attr("width"),
    //height = +svg.attr("height");
var g = svgSan.append("g").
        attr("class","gsan");

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d); },
    color = d3.scale.category10();

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [widthSan - 1, heightSan - 6]]);

function updateData(){

    d3.select(".links_s").remove();
d3.select(".nodes_s").remove();

var link = svgSan.append("g")
    .attr("class", "links_s")
    .attr("fill", "None")
    .attr("stroke", "#ABCDEF")
    .attr("stroke-opacity", 0.8)
    .selectAll("g");


var node = svgSan.append("g")
    .attr("class", "nodes_s")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    //.on("mouseover",handleMouseOver)
    .selectAll("g");


    console.log("update data:")
d3.json("assets/data/energy.json", function(error, energy) {
 // if (error) throw error;

console.log(energy)

  sankey(energy);

  link = link
    .data(energy.links)
    .enter().append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); })
     //.on("mouseover",handleMouseOver)

      link
      .on("mouseover",function(d,i){
          d3.select(this)
          .attr("stroke","#6397D0")
      });

      link.on("mouseout",function(d,i){
          d3.select(this)
          .attr("stroke","#ABCDEF")
      });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  node = node
    .data(energy.nodes)
    .enter().append("g");

  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", "#9e9e9e")
      .attr("stroke", "#000");

  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < widthSan / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

  node.append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
});
}


function updateDataAll(){

d3.select(".links_s").remove();
d3.select(".nodes_s").remove();

var link = svgSan.append("g")
    .attr("class", "links_s")
    .attr("fill", "None")
    .attr("stroke", "#ABCDEF")
    .attr("stroke-opacity", 0.8)
    .selectAll("g")
    ;



var node = svgSan.append("g")
    .attr("class", "nodes_s")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    //.on("mouseover",handleMouseOver)
    .selectAll("g");

    console.log("update dataAll")
d3.json("assets/data/energy3.json", function(error, energy) {
 // if (error) throw error;

console.log(energy)

  sankey(energy);

  link = link
    .data(energy.links)
    .enter().append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); })
     //.on("mouseover",handleMouseOver)


      link
      .on("mouseover",function(d,i){
          d3.select(this)
          .attr("stroke","#6397D0")
      });

      link.on("mouseout",function(d,i){
          d3.select(this)
          .attr("stroke","#ABCDEF")
      });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  node = node
    .data(energy.nodes)
    .enter().append("g");

  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", "#9e9e9e")
      .attr("stroke", "#000");

  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < widthSan / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

  node.append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
      
});
}


updateData();
