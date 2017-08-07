

var dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];


// Creo una variabile SVG
var svg = d3.select("#barchart").append("svg")
            .attr("height","100%")
            .attr("width","100%")



//appendo all'SVG tanti rettangoli quanti sono i valori della variabile input, poi definisco gli attributi dei rettangoli
svg.selectAll("rect")
    .data(dataArray)
    .enter().append("rect")
            .attr("class", "bar")
            .attr("height", function(d, i) {return (d * 10)}) // altezza pari al valore moltiplicato 10
            .attr("width","40") // largezza fissa a 40
            .attr("x", function(d, i) {return (i * 60) + 25})
            .attr("y", function(d, i) {return 400 - (d * 10)});

// per inserire le lable
svg.selectAll("text")
    .data(dataArray)
    .enter().append("text")
    .text(function(d) {return d;})
      .attr("x", function(d, i) {return (i * 60) + 36})
      .attr("y", function(d, i) {return 390 - (d * 10)});
