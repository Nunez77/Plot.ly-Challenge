// Create a horizontal bar chart with a dropdown menu
// to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.


// Setup frame
const svgWidth = 960;
const svgHeight = 500;
const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append SVG group
const chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Empty values
var chartData = null;

// Set up axes and initial parameters
let theXaxis = "Poverty";
let theYaxis = "Healthcare";

var xAxisLabels = ["Poverty", "Age", "Income"];  // Default 
var yAxisLabels = ["Obesity", "Smokes", "Healthcare"];
var labelsTitle = { "poverty": "In Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };

// Create Scales.
function xScale(bellyData,theXaxis){
  var ScaleX = d3.scaleLinear()
      .domain([d3.min(bellyData, d=>d[theXaxis])*0.9, d3.max(bellyData,d=>d[theXaxis])*1.1])
      .range([0,width])
  return ScaleX;
}

function yScale(bellyData, theYaxis) {
    var ScaleY = d3.scaleLinear()
        .domain([d3.min(bellyData, d => d[theYaxis]) * .9,d3.max(bellyData, d => d[theYaxis]) * 1.1 ])
        .range([height, 0]);
  
    return ScaleY;
  }

// Update x-axis function
function renderXAxes(newXScale, xAxis) {
    var IntersectX = d3.axisX(newXScale);
  
    xAxis.transition()
          .duration(1000)
          .call(IntersectX);
  
    return xAxis;
  }

  // Update y-axis function
  function renderYAxes(newYScale, yAxis) {
    var IntersectY = d3.axisY(newYScale);
  
    yAxis.transition()
          .duration(1000)
          .call(IntersectY);
  
    return yAxis;
  }

  // Updating circles function
  function renderCircles(circlesGroup, newXScale, newYScale, theXaxis, theYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[theXaxis]))
      .attr("cy", d => newYScale(d[theYaxis]));
  
    return circlesGroup;
  }

  // New text transition function
function renderText(circletextGroup, newXScale, newYScale, theXaxis, theYaxis) {
  circletextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[theXaxis]))
    .attr("y", d => newYScale(d[theYaxis]));
      
  return circletextGroup;
}

// Tooltip update function
function updateToolTip(theXaxis, theYaxis, circlesGroup) {
  // Selection of X axis
  if (theXaxis === "poverty") {
    var xlabel = "Poverty";
  }
  else if (theXaxis === "age") {
    var xlabel = "Age"
  }
  else {
    var xlabel = "Median Income"
  }
  // Selection of Y axis
  if (theYaxis === "smokes") {
    var ylabel = "Smokers"
  }
  else if (theYaxis === "healthcare") {
    var ylabel = "Available Healthcare";
  }
  else {
    var ylabel = "Obesity"
  }

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .style("background", "black")
  .style("color", "gray")
  .offset([120, -60])
  .html(function(d) {
      if (theXaxis === "age") {
          // Y Axis will be a %
          return (`${d.state}<hr>${xlabel} ${d[theXaxis]}<br>${ylabel}${d[theYaxis]}%`);
          // Y Axis no format
        } else if (theXaxis !== "poverty" && theXaxis !== "age") {
          // X Axis in %
          return (`${d.state}<hr>${xlabel}$${d[theXaxis]}<br>${ylabel}${d[theYaxis]}%`);
        } else {
          // Same here
          return (`${d.state}<hr>${xlabel}${d[theXaxis]}%<br>${ylabel}${d[theYaxis]}%`);
        }      
  });

  circlesGroup.call(toolTip);
  // When mouse on
  circlesGroup.on("mouseon", function(data) {
    toolTip.show(data, this);
  })
  // When mouse out
   .on("mouseout", function(data,index) {
    toolTip.hide(data)
  });

return circlesGroup;
}


// Import Data
d3.json("samples.json").then(function(bellyData) {

    // Sum up frequency of attributes
    bellyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // Set up scale according to selected variables
    var ScaleX = xScale(bellyData, theXaxis);
    var ScaleY = yScale(bellyData, theYaxis);


    // Set up axis according to selected variables
    var IntersectX = d3.axisX(ScaleX);
    var IntersectY = d3.axisY(ScaleY);

    // Configure set up in chart
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(IntersectX);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(IntersectY);

      
    // Draw the circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(bellyData)
    .enter()
    .append("circle")
    .attr("cx", d => ScaleX(d[theXaxis]))
    .attr("cy", d => ScaleY(d[theYaxis]))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    // Add State abbr. text to circles. and some offset to y
    var circletextGroup = chartGroup.selectAll()
    .data(bellyData)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr("x", d => ScaleX(d[theXaxis]))
    .attr("y", d => ScaleY(d[theYaxis]))
    .style("font-size", "11px")
    .style("text-anchor", "middle")
    .style('fill', 'black');

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty") // value to grab for event listener.
        .classed("active", true)
        .text("In Poverty (%)");
    
    var healthcareLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height+12))
        .attr("value", "healthcare") // value to grab for event listener.
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener.
        .classed("inactive", true)
        .text("Age (Median)");

    var smokeLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height +32))
        .attr("value", "smokes") // value to grab for event listener.
        .classed("inactive", true)
        .text("Smokes (%)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener.
        .classed("inactive", true)
        .text("Household Income (Median)");

    var obesityLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (margin.left) * 2.8)
        .attr("y", 0 - (height +52))
        .attr("value", "obesity") // value to grab for event listener.
        .classed("inactive", true)
        .text("Obesity (%)");

    // Update tool tip function above csv import.
    var circlesGroup = updateToolTip(theXaxis, theYaxis, circlesGroup);

    // X Axis labels event listener.
    labelsGroup.selectAll("text")
        .on("click", function() {
        // Get value of selection.
          var value = d3.select(this).attr("value");
          console.log(value)

        //if select x axises
          if (true) {
              if (value === "poverty" || value === "age" || value === "income") {
                // Replaces theXaxis with value.
                theXaxis = value;

                // Update x scale for new data.
                ScaleX = xScale(bellyData, theXaxis);

                // Updates x axis with transition.
                xAxis = renderXAxes(ScaleX, xAxis);

                // Update circles with new x values.
                circlesGroup = renderCircles(circlesGroup, ScaleX, ScaleY, theXaxis, theYaxis);

                // Update tool tips with new info.
                circlesGroup = updateToolTip(theXaxis, theYaxis, circlesGroup);

                // Update circles text with new values.
                circletextGroup = renderText(circletextGroup, ScaleX, ScaleY, theXaxis, theYaxis);

                // Changes classes to change bold text.
                if (theXaxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (theXaxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)

                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }}

           else {
                    theYaxis = value;
                    //console.log("you choosed y axis")
              
                    // Update y scale for new data.
                    ScaleY = yScale(bellyData, theYaxis);

                    // Updates y axis with transition.
                    yAxis = renderYAxes(ScaleY, yAxis);

                    // Update circles with new x values.
                    circlesGroup = renderCircles(circlesGroup, ScaleX, ScaleY, theXaxis, theYaxis);

                    // Update tool tips with new info.
                    circlesGroup = updateToolTip(theXaxis, theYaxis, circlesGroup);

                    // Update circles text with new values.
                    circletextGroup = renderText(circletextGroup, ScaleX, ScaleY, theXaxis, theYaxis);

                    // Changes classes to change bold text.
                    if (theYaxis === "healthcare") {

                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);


                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                          }
                    else if (theYaxis === "smokes"){
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        smokeLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                          }
                    else {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        smokeLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        }
                   } 
                  }
                
          });
    
    });