
var data;
// Get the data
d3.json("assets/js/hier_skills.json", function(error, hbcdata) {
  console.log("json:",hbcdata)
 
  hbcdata.forEach(function(d) {
		d.value = +d.value;
  });

	d3.select('#inds')
			.on("change", function () {
				var sect = this
				console.log(sect);
				var section = sect.options[sect.selectedIndex].value;
                console.log(section)

				data = filterJSON(hbcdata, 'skill', section);

                console.log(data)
	      //debugger
	      
		    data.forEach(function(d) {
    			d.frequenza = +d.frequenza;
    			d.active = true;
    		});
    		
		    
		    //debugger
				updatehbcSkill(data);
			});

	// generate initial graph
	data = filterJSON(hbcdata, 'skill', 'Pacchetto Office');
	updatehbcSkill(data);

});

function filterJSON(dati, key, value) {
   console.log("filter: ",key, value, dati)
  var result = [];
  dati.forEach(function(val,idx,arr){
    //  console.log("foreach")
     // console.log("check",key, val[key], value)
    if(val[key] == value){
     // console.log("found")
      result.push(val)
    }
  })
  console.log("risultato: ",result);
  return result;

}


function updatehbcSkill(data){
	//set domain for the x axis
    console.log("update:", data)
	yChart.domain(data.map(function(d){ 
		return d.figura;
		/*
    	console.log("ychart: ",d.figura);
		t=""+d.figura;
        return ""+d.figura.substring(0,30); 
	 
		*/
	}));
	//set domain for y axis
	xChart.domain( [0, d3.max(data, function(d){
		//console.log("frea: ",+d.frequenza);
		 return +d.frequenza; })] );

	//console.log("xch",xChart)
	
	//get the width of each bar 
	var barHeight = heightBC / data.length;
	
	//select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chart.selectAll(".bar")
					.data(data)
					.remove()
					.exit()
					.data(data)		

	//now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "bar")
		//.attr("x", function(d, i){ return i * barHeight + 1 })
		.attr("x",0)
		.attr("y", function(d, i){ console.log("y: ", i*barHeight+1)
			return  i * barHeight + 1 })
			//return d.frequenza;})
		//.attr("width", function(d){console.log("valore", xChart(d.frequenza)) 
		//	return height - xChart(d.frequenza); })
		.attr("height", barHeight - 10)
		//.attr("fill", "red")
		.attr("width",0)
		.transition()
		.duration(1000)
		.attr("width", function(d){
			//console.log("width: ",d.frequenza, xChart(d.frequenza))
			return xChart(d.frequenza); });
	//left axis


	bars
            .on("mousemove", function(d){
                divSBC.style("left", d3.event.offsetX+10+"px");
                divSBC.style("top", d3.event.offsetY-25+"px");
                divSBC.style("display", "inline-block");
                divSBC.html((d.figura)+"<br>"+(d.frequenza));
            });
    bars
            .on("mouseout", function(d){
                divSBC.style("display", "none");
            });
	
	chart.select('.yAxis')
		  .call(yAxis)
		  .selectAll("text")
		  //.style("text-anchor", "middle")
		  .append("title")
		  .text(function(d){ return d;});
		  
		  
	//bottom axis
	chart.select('.xAxis')
		//.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
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
var widthBC = 550;
var heightBC = 400;

var divSBC = d3.select("#hierbcskill")
	.append("div")
	.attr("class","toolTipSkillBC");

var svgS = d3.select("#hierbcskill")
				.append("svg")
				.attr("width", widthBC + margin.left + margin.right)
				.attr("height", heightBC + margin.top + margin.bottom)
				
var chart = svgS.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xChart = d3.scale.linear()
				.range([0, widthBC]);
				
var yChart = d3.scale.ordinal()
	.rangeRoundBands([0, heightBC], .1) 


var xAxis = d3.svg.axis().orient("top").scale(xChart);
var yAxis = d3.svg.axis().orient("left").scale(yChart);
	yAxis.tickFormat(function(d){
      return d.substring(0,16);
    });


//set up axes
//left axis

	chart.append("g")
		  .attr("class", "yAxis")
		  .call(yAxis)
		  
      	
    
	//bottom axis
	chart.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate("-10+"," + heightBC + ")")
		.call(xAxis)
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
chart
	.append("text")
	.attr("transform", "translate(-70," +  (heightBC+margin.bottom)/2 + ") rotate(-90)");
		
chart
	.append("text")
	.attr("transform", "translate(" + (widthBC/4) + "," + ( -30) + ")");

