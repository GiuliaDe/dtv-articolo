
    //Constants for the SVG
    var widthFG = 700,
        heightFG = 380;

    //Set up the colour scale
    
    var colorsFG = d3.scale.ordinal()
    .domain(['9','8','7', '6', '3', '4','5','2','1'])
    .range(colorbrewer.Greens[9]);


    //Set up the force layout
    var force = d3.layout.force()
        .charge(function(d) {
            return -d.weight * 100
        })
        .linkDistance(200)
        .gravity(0.5)
        .size([widthFG, heightFG]);


    //Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svgFG = d3.select("#forcegraph").append("svg")
        .attr("width", widthFG)
        .attr("height", heightFG);

    var linksFG = [];

    //Read the data from the mis element 
    d3.json("assets/data/f_graph.json", function(error, graph) {
        if (error) throw error;
        console.log("graph.nodes", graph.nodes)
        console.log("graph.links", graph.links)

        var edges = [];
        graph.links.forEach(function(e) {
            var sourceNode = graph.nodes.filter(function(n) {
                return n.id === e.source;
            })[0]
            var targetNode = graph.nodes.filter(function(n) {
                return n.id === e.target;
            })[0];

            edges.push({
                source: sourceNode,
                target: targetNode,
                value: e.value
            });
        });

        console.log("edges", edges)
        var edges = edges.filter(function(d) {
            return d.value > 50;
        });
        console.log("filtered edges", edges)
            //Creates the graph data structure out of the json data
        force.nodes(graph.nodes)
            .links(edges)
            .start();


        //Create all the line svgs but without locations yet
        var linksFG = svgFG.selectAll(".linkFG")
            .data(function(d) {
                return edges
            })
            .enter().append("line")
            .attr("class", "linkFG")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value)/3;
            });



        //Do the same with the circles for the nodes - no 
        //Changed
        var nodeFG = svgFG.selectAll(".nodeFG")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "nodeFG")
            // .on('mouseover', tip.show) //Added
            // .on('mouseout', tip.hide) //Added 
            .call(force.drag);

        nodeFG.append("circle")
            .attr("r", function(d) {
                return Math.sqrt(d.count/Math.PI);
            }) //d.weight

        .style("fill",  "#8FC983")
            .style("stroke","#8FC983")

         nodeFG.append("title")
             .attr("dx", 10)
             .attr("dy", ".35em")
             .text(function(d) { return d.id });
        //End changed


        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
        force.on("tick", function() {
            linksFG.attr("x1", function(d) {

                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            //Changed

            svgFG.selectAll("circle").attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });

            svgFG.selectAll("text").attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                });

            //End Changed

        });

        var radius = d3.scale.sqrt()
            .range([5, 15])
            .domain([1, 36]);


    });

    // //Do the same with the circles for the nodes - no
    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function (d) {
    //     return  "ID: "+d.id +"</br>Degree: "+d.weight;
    // })
    // svg.call(tip);