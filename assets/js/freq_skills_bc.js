data = [{"x": "Pacchetto Office", "y": "7386"}, {"x": "SQL", "y": "3761"}, {"x": "Java", "y": "3658"}, {"x": "JavaScript", "y": "2939"}, {"x": "AutoCAD", "y": "2267"}, {"x": "Oracle", "y": "1978"}, {"x": "HTML", "y": "1862"}, {"x": "C#", "y": "1775"}, {"x": "CSS", "y": "1631"}, {"x": "PHP", "y": "1520"}, {"x": "Linux", "y": "1477"}, {"x": "jQuery", "y": "1401"}, {"x": "HTML5", "y": "1176"}, {"x": "MySQL", "y": "1106"}, {"x": "Spring", "y": "1010"}, {"x": "social network", "y": "988"}, {"x": "SolidWorks", "y": "908"}, {"x": "Android", "y": "887"}, {"x": "Android O", "y": "887"}, {"x": "C++", "y": "821"}, {"x": "Microsoft Office", "y": "783"}, {"x": "ASP.NET", "y": "770"}, {"x": "Hibernate", "y": "683"}, {"x": "XML", "y": "674"}, {"x": "Calibre", "y": "652"}, {"x": "Bootstrap", "y": "643"}, {"x": "WordPress", "y": "605"}, {"x": "iOS", "y": "599"}, {"x": "AngularJS", "y": "596"}, {"x": "Angular", "y": "581"}, {"x": "PL/SQL", "y": "550"}, {"x": "Python", "y": "490"}, {"x": "Git", "y": "486"}, {"x": "JBoss", "y": "450"}, {"x": "Simula", "y": "418"}, {"x": "IBM i", "y": "413"}, {"x": "R", "y": "401"}, {"x": "Scala", "y": "398"}, {"x": "Objective C", "y": "392"}, {"x": "Unix", "y": "390"}, {"x": "SAS", "y": "384"}, {"x": "Windows Server", "y": "364"}, {"x": "Eclipse", "y": "322"}, {"x": "Pure", "y": "304"}, {"x": "Content mngt", "y": "267"}, {"x": "Visual Basic", "y": "253"}, {"x": "Script", "y": "252"}, {"x": "Onyx", "y": "247"}, {"x": "Mg", "y": "246"}]

var div = d3.select("#allSkillsBC")
        .append("div")
        .attr("class", "toolTipBC");

    var axisMargin = 20,
            margin = 40,
            yMargin = 4,
            width = parseInt(d3.select('#allSkillsBC').style('width'), 10),
            height = parseInt(d3.select('#allSkillsBC').style('height'), 10),
            barHeight = (height-axisMargin-margin*2)* 0.45/data.length,
            barPadding = (height-axisMargin-margin*2)*0.6/data.length,
            data, bar, svg, scale, xAxis, xWidth = 0;

    max = d3.max(data, function(d) { return d.y; });

    svg = d3.select('#allSkillsBC')
            .append("svg")
            .attr("width", width)
            .attr("height", height);


    bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "x")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.x;
            }).each(function() {
        xWidth = Math.ceil(Math.max(xWidth, this.getBBox().width));
    });

    scale = d3.scale.linear()
            .domain([0, 7500])
            //.range([0,7500])
            .range([0, width - margin - xWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + margin + axisMargin)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+xWidth+", 0)")
            .attr("height", barHeight)
            .attr("width", function(d){
                return scale(d.y);
            });

    bar.append("text")
            .attr("class", "y")
            .attr("y", barHeight / 2)
            .attr("dx", -yMargin + xWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            /*.text(function(d){ return (d.y);})*/
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + yMargin, scale(d.y));
            });

    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.offsetX+10+"px");
                div.style("top", d3.event.offsetY-25+"px");
                div.style("display", "inline-block");
                div.html((d.x)+"<br>"+(d.y));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });

    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + xWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);