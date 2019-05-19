// determine chart area
var svgWidth = 900;
var svgHeight = 500;

// set margins
var margin = {
  top: 20,
  right: 100,
  bottom: 70,
  left: 100
};

// set chart and subtract margins 
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth  = svgWidth - margin.left - margin.right;

var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chartGroup = svg.append("g")

// read the data
    d3.csv("/data/data.csv", function(err, errror) {
    if (err) throw err;
    console.log(errror)
    
    // process the data
    for (var i = 0; i < errror.length; i++) {
        console.log(i, errror[i].state, errror[i].poverty, errror[i].healthcare );
        console.log(i, errror[i].obesity, errror[i].income  );
    }

    errror.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      })
  
       // scale the chart 
      var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
      // scale x to chart width
      var xLinearScale = d3.scaleLinear().range([0, chartWidth]);
  
      // create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      xLinearScale.domain([8,
          d3.max(errror, function(data) {
          return +data.poverty * 1.05;
        }),
      ]);

      yLinearScale.domain([0,
          d3.max(errror, function(data) {
          return +data.healthcare * 1.1;
        }),
      ]);
  
      console.log("creating tooltip")
      // create tool tip
      var toolTip = d3
        .tip()
        .attr('class', 'tooltip')
        .offset([60, 15])
        //.offset([80, -60])
        .html(function(data) {
            var state = data.state;
            var poverty = +data.poverty;
            var healthcare = +data.healthcare;
            return (
            state + '<br> Poverty Percentage: ' + poverty + '<br> Lacks Healthcare Percentage: ' + healthcare
            );
        });
  
      chartGroup.call(toolTip);
      
      // generate Scatter Plot
      chartGroup
      .selectAll('circle')
      .data(brfssdata)
      .enter()
      .append('circle')
      .attr('cx', function(data, index) {
        return xLinearScale(data.poverty);
      })
      .attr('cy', function(data, index) {
        return yLinearScale(data.healthcare);
      })
      .attr('r', '16')
      .attr('fill', 'lightgreen')
      .attr('fill-opacity',0.6)
      // display mouseover function 
      .on("mouseover",function(data) {
        toolTip.show(data);
      })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
      chartGroup.append('g').call(leftAxis);
  
      svg.selectAll(".dot")
      .data(brfssdata)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.poverty);
      })
      .attr('y', function(data) {
        return yLinearScale(data.healthcare);
      })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
  
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('No Healthcare (%)');
  
      // x-axis labels
      chartGroup
        .append('text')
        .attr(
          'transform',
          'translate(' + chartWidth / 2 + ' ,' + (chartHeight + margin.top + 40) + ')',
        )
        .attr('class', 'axisText')
        .text('Poverty (%)'); 


})
