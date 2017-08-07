var width = 500;
    height = 600;

// MAP Preparation
var svg = d3.select("#choropleth")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// projection
var projection = d3.geo.mercator()
    .scale(1700)
    .center([13, 42])
    .translate([width / 2, height / 2]);

// path transofrmer (from coordinates to path definition)
var path = d3.geo.path().projection(projection);
var gg = svg.append("g")

// first child g to contain background
var sfondo = gg.append("g")
    .append("rect")
    .attr("class", "backgroundMap")
    .attr('width', width)
    .attr('height', height)
    .style('fill', "#e9e9e9")
    //  using patterns:
    // .style("fill", "url(#whitecarbon)")
    .style("fill-opacity", 0.2);

// second child g to contain map
var g = gg.append("g")
    .attr("class", "map")
    .style("fill", "lightgray");

// LEGEND Preparation
var legendRectSize = 18;
var legendSpacing = 4;


// COLOR SCALE
// color scale Birth Place gray
var digitalJobsColor = d3.scale.quantile()
    .range(colorbrewer.Blues[9]);
// color scale Artwork Place orange
var allJobsColor = d3.scale.quantile()
    .range(colorbrewer.Greens[9]);
var percentDigColor = d3.scale.quantile()
    .range(colorbrewer.Oranges[9]);


digital_count = {}
all_count = {}
percent_count = {}



// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltipMap")
    .style("opacity", 0);


// DATA PREPARATION
var dsv = d3.dsv(",", "text/plain");
var all_prov = {}
var digi_prov = {}
var perCent_prov = {}

d3.queue()
    .defer(d3.json, "assets/data/regioni_province_4326.geojson")
    .defer(dsv, "assets/data/job_perProvincia_sigla.csv", function(d) {
        // filter only useful attributes:
        //console.log("job all",d);
        var ap = all_prov[d.provincia] || (all_prov[d.provincia] = +d.numero_jobs); //{name_p: d.provincia, numero_jobs: +d.numero_jobs});
        // return the modified row
         //console.log("ap",ap);
        return ap;
        attributesHandler["allJobs"].valueSelector = all_prov[d.provincia];
        console.log("ap fin",ap);
        console.log("alljobs:", attributesHandler["allJobs"].valueSelector);
    })
    .defer(dsv, "assets/data/all_digitalJobs_perProvincia_sigla.csv", function(d) {
        // filter only useful attributes:
        // ANNO_ARTWORK, ARTWORK_PLACE, ARTWORK_PLACE_LAT, ARTWORK_PLACE_LON, MUSEUM
        // TECHNIQUE, TYPE, SCHOOL
        //console.log("job dig");
        var dp = digi_prov[d.provincia] || (digi_prov[d.provincia] = +d.numero_jobs);
        // return the modified row
        return dp;
        attributesHandler["digitalJobs"].valueSelector = digi_prov[d.provincia];
        console.log("dp",dp);
        console.log("dig jobs: ",attributesHandler["digitalJobs"].valueSelector);

    })
    .defer(dsv, "assets/data/Percent_dig_perProv.csv", function(d) {
        // filter only useful attributes:
        // ANNO_ARTWORK, ARTWORK_PLACE, ARTWORK_PLACE_LAT, ARTWORK_PLACE_LON, MUSEUM
        // TECHNIQUE, TYPE, SCHOOL
        //console.log("job dig");
        var pp = perCent_prov[d.provincia] || (perCent_prov[d.provincia] = +d.percent_dig);
        // return the modified row
        return pp;
        attributesHandler["percentDig"].valueSelector = perCent_prov[d.provincia];
        console.log("pp",pp);
        console.log("percent dig: ",attributesHandler["percentDig"].valueSelector);

    })
    .await(callback);
////console.log("all_prov", all_prov);
////console.log("digi_prov", digi_prov);

// HANDLER
var attributesHandler = {
    "digitalJobs": {
        value: "digitalJobs",
        label: "Lavori digitali",
        count: digi_prov,
        colorScale: digitalJobsColor,
        valueSelector: function(d) {
            console.log("dg color",d);
            return digitalJobsColor(digi_prov[d.properties.SIGLA] || 0); // se indefinito assegna ZERO
        },
        title: "Digital Jobs",
        description: "Numero di offerte per lavori con competenze digitali per provincia"
    },
    "allJobs": {
        value: "allJobs",
        label: "Lavori totali",
        count: all_prov,
        colorScale: allJobsColor,
        valueSelector: function(d) {
            return allJobsColor(all_prov[d.properties.SIGLA] || 0); // se indefinito assegna ZERO
        },
        title: "All Jobs",
        description: "Numero di offerte lavorative per provincia"
    },
    "percentDig": {
        value: "percentDig",
        label: "% digitale",
        count: perCent_prov,
        colorScale: percentDigColor,
        valueSelector: function(d) {
            return percentDigColor(perCent_prov[d.properties.SIGLA] || 0); // se indefinito assegna ZERO
        },
        title: "Digital Percentage",
        description: "Percentuale di offerte digitali sul totale per provincia"
    }
};



function callback(error, mappa, all, digital) {
    if (error) console.log("error", error);
    json = mappa.features;
    //console.log("mappa features",json)

    // draw basic map
    path = g.selectAll('path')
        .data(json)
        .enter()
        .append("path")
        .attr("class", "provincia")
        .attr("id", function(d) {
            return d.properties.SIGLA
        }) //assign class for additional styling
        .attr("d", path)
        //.style('fill', 'yellow')
        .style('fill', attributesHandler.colorScale) //"light-grey")
        .style('stroke', 'black')
        .style('stroke-width', 0.3)



    // SET DOMAINS FOR COLOR SCALES
    // set domain for digitalJobsColor;
    digitalJobsColor.domain(d3.values(digi_prov));
    // set domain for allJobsColor;
    allJobsColor.domain(d3.values(all_prov));
    percentDigColor.domain(d3.values(perCent_prov));
    // functions must be called into callback to use data!!!
    changeMap('allJobs');
    setTooltip('allJobs');


};



function setTooltip(selection) {

    // TOOLTIP on countries mouseover
    path.on("mouseover", function(d) {
            //console.log("selection", selection)
            tooltip.transition()
                .duration(200)
                .style("opacity", .8);
            tooltip.html("<strong>" + d.properties.SIGLA + "</strong><br/>" + attributesHandler[selection]["count"][d.properties.SIGLA] || 0)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            //console.log("provincia cliccata", d.properties.SIGLA);
            //aggiungo il nome stato
            prov = d.properties["PROVINCIA"];
            d3.select("#colonna1 h4").text("Provincia: " + prov);
        });

}


//// MAIN FUNCTION TO CONTROL MAP
function changeMap(selection) {

    var handler = attributesHandler[selection];
    updateMapColors(handler.colorScale, handler.valueSelector);

    //Change Title Map
    d3.select("#titleMap")
        .text(handler.title)
        //Change Map Legend
    d3.select("#mapDescription")
        .text(handler.description)
        //Change Legend
    updateLegend(handler.colorScale);
    setTooltip(handler.count);
}


function updateMapColors(colorScale, valSel) {
    console.log("update colors", valSel);
    svg.selectAll("path.provincia")
        .transition()
        .duration(750)
        .attr("fill", valSel)
        //added function to handler!!!

    .attr('opacity', 0.7)
        .attr('stroke', "black")
        .attr('stroke-width', 0.2)
        //.attr('stroke-dasharray',(3,3) )
    ;

}

// ADD BUTTONS
// http://getbootstrap.com/components/#btn-groups-single
// <div class="btn-group" role="group" aria-label="...">
//   <button type="button" class="btn btn-default">First</button>
//   <button type="button" class="btn btn-default">Second</button>
// </div>

var buttonGroup = d3.select("#instructions")
    .append("div")
    .attr("id", "buttonGroup")
    .classed("btn-group", true)
    .classed("btn-group-xs", true)
    .attr("role", "group");

//console.log("handler", d3.values(attributesHandler));

buttonGroup.selectAll("button")
    .data(d3.values(attributesHandler))
    .enter()
    .append("button")
    .attr("type", "button")
    .classed("btn", true)
    .classed("btn-default", true)
    .attr("value", function(d) {
        return d.value
    })
    .text(function(d) {
        return d.label
    })
    .on("click", function() {
        var val = this.value;
        //console.log("button_val", val);
        // call functions on click
        changeMap(val);
        setTooltip(val);
    });


// ADD LEGEND SECTION
function updateLegend(colorScale) {

    d3.select("#legendMap svg").remove();

    var legend = d3.select("#legendMap")
        .append("svg")
        .attr('height', 180)
        .selectAll('g')
        .data(colorScale.range())
        .enter()
        .append('g')
        .attr('class', 'legendEntry');


    legend.append('rect')
        .attr("x", 20) //leave 5 pixel space after the <rect>
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("stroke", "black")
        .style("stroke-width", 0.2)
        .style("fill", function(d) {
            return d;
        })
        .attr("opacity", 0.7);

    legend.append('text')
        .text(function(d, i) {
            var extent = colorScale.invertExtent(d);
            //extent will be a two-element array, format it however you want:
            var format = d3.format("0f");
            return format(+extent[0]) + " - " + format(+extent[1]);
        })
        .attr("x", 50) //leave 5 pixel space after the <rect>
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("dy", "1.2em") //place text one line *below* the x,y point
        .attr('fill', "black")
        // .attr("dy", "0.8em") //place text one line *below* the x,y point

    /// END LEGEND SECTION ///

}
