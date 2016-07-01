var createChart = function(){

	var width = 800,
		height = window.innerHeight - 200;


	var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

	var y = d3.scale.linear()
		.range([height, 0]);

	var x = d3.scale.linear()
    	.range([0, width], 0);

    var barWidth = width / errorData.length;

	var chart = d3.select(".chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	y.domain([0, d3.max(errorData)]);
	x.domain([0, iterations]);

	var bar = chart.selectAll("g")
			.data(errorData)
		.enter().append("g")
			.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
		.attr("class", "bar")
		.attr("y", function(d) { return y(d); })
		.attr("height", function(d) { return height - y(d); })
		.attr("width", barWidth);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(10, "");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "");

	chart.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		.append("text")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Iteration");

	chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -10)
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Error");
};

var createNet = function(struct){

	
};
