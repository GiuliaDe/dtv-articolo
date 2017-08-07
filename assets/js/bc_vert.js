

var data;
// Get the data
d3.json("assets/data/hier_figure.json", function(error, json) {
  console.log("hf",json)
 
  json.forEach(function(d) {
		d.value = +d.value;
  });

	d3.select('#indsfig')
			.on("change", function () {
				var sect = this
				var section = sect.options[sect.selectedIndex].value;
                console.log(section)

				dataF = filterJSON(json, 'figura', section);

                //console.log(data)
	      //debugger
	      
		    dataF.forEach(function(d) {
    			d.frequenza = +d.frequenza;
    			//d.year = parseDate(String(d.year));
    			d.active = true;
    		});
    		
		    
		    //debugger
				updatehbcFigura(dataF);


				//jQuery('h1.page-header').html(section);
			});

	// generate initial graph
	dataF = filterJSON(json, 'figura', 'Analisti e progettisti di software');
	updatehbcFigura(dataF);

});

function filterJSON(json, key, value) {
  //  console.log("filter: ",key, value, json)
  var result = [];
  json.forEach(function(val,idx,arr){
    //  console.log("foreach")
     // console.log("check",key, val[key], value)
    if(val[key] == value){
     // console.log("found")
      result.push(val)
    }
  })
  //console.log("risultato: ",result);
  return result;

}


function updatehbcFigura(data){
	//set domain for the x axis
    console.log("data figura :", data)
	yChartF.domain(data.map(function(d){ 
    //	 console.log("ychart: ",d);
        return d.skill; }) );
	//set domain for y axis
	xChartF.domain( [0, d3.max(data, function(d){
		//console.log("frea: ",+d.frequenza);
		 return +d.frequenza; })] );

	//console.log("xch",xChart)
	
	//get the width of each bar 
	var barHeight = heightBCf / data.length;
	
	//select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chartF.selectAll(".barF")
					.data(data)
					.remove()
					.exit()
					.data(data)		
	//now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "barF")
		//.attr("x", function(d, i){ return i * barHeight + 1 })
		.attr("x",0)
		.attr("y", function(d, i){ console.log("y: ", i*barHeight+1)
			return  i * barHeight + 1 })
		
			//return d.frequenza;})
		//.attr("width", function(d){console.log("valore", xChart(d.frequenza)) 
		//	return height - xChart(d.frequenza); })
		.attr("height", barHeight - 10)
		.attr("fill", "#ABCDEF")
		.attr("width", 0)
		.transition()
		.duration(1000)
		.attr("width", function(d){
			//console.log("width: ",d.frequenza, xChart(d.frequenza))
			return xChartF(d.frequenza); })
		;
		
	//left axis

	bars
            .on("mousemove", function(d){
                divFBC.style("left", d3.event.offsetX+10+"px");
                divFBC.style("top", d3.event.offsetY-25+"px");
                divFBC.style("display", "inline-block");
                divFBC.html((d.skill)+"<br>"+(d.frequenza));
            });
    bars
            .on("mouseout", function(d){
                divFBC.style("display", "none");
            });
	
	chartF.select('.yAxisF')
		  .call(yAxisF)
		  .selectAll("text")
		  .append("title")
		  .text(function(d){ return d;});
		  
		  
	//bottom axis
	chartF.select('.xAxisF')
		//.attr("transform", "translate(0," + height + ")")
		.call(xAxisF)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", ".8em")
			.attr("dy", ".15em")
			/*
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			*/
			
}//end update

//set up chart
var margin = {top: 80, right: 20, bottom: 35, left: 100};
var widthBCf = 550;
var heightBCf = 400;

var divFBC = d3.select("#hierbcfigure")
	.append("div")
	.attr("class","toolTipFigureBC");

var svgF = d3.select("#hierbcfigure")
				.append("svg")
				.attr("width", widthBCf + margin.left + margin.right)
				.attr("height", heightBCf + margin.top + margin.bottom)
				.attr("class","toolTipDropBC")
				
var chartF = svgF.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xChartF = d3.scale.linear()
				.range([0, widthBCf]);
				
var yChartF = d3.scale.ordinal()
	.rangeRoundBands([0, heightBCf], .1) 


var xAxisF = d3.svg.axis().orient("top").scale(xChartF);
var yAxisF = d3.svg.axis().orient("left").scale(yChartF);


//set up axes
//left axis

	chartF.append("g")
		  .attr("class", "yAxisF")
		  .call(yAxisF)
		  
      	
    
	//bottom axis
	chartF.append("g")
		.attr("class", "xAxisF")
		.attr("transform", "translate("-10+"," + heightBCf + ")")
		.call(xAxisF)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", ".8em")
			.attr("dy", ".15em")
			/*
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			*/

//add labels
chartF
	.append("text")
	.attr("transform", "translate(-70," +  (heightBCf+margin.bottom)/2 + ") rotate(-90)");
		
chartF
	.append("text")
	.attr("transform", "translate(" + (widthBCf/4) + "," + ( -30) + ")");


//use bothData to begin with
//update(data);