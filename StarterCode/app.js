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
let chosenXAxis = "Poverty";
let chosenYAxis = "Healthcare";

var xAxisLabels = ["Poverty", "Age", "Income"];  // Default 
var yAxisLabels = ["Obesity", "Smokes", "Healthcare"];
var labelsTitle = { "poverty": "In Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };

// Create Scales.
function xScale(healthData,chosenXAxis){
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenXAxis])*0.9, d3.max(healthData,d=>d[chosenXAxis])*1.1])
      .range([0,width])
  return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * .9,d3.max(healthData, d => d[chosenYAxis]) * 1.1 ])
        .range([height, 0]);
  
    return yLinearScale;
  }

// Update x-axis function
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
  
    return xAxis;
  }

  // Update y-axis function
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
          .duration(1000)
          .call(leftAxis);
  
    return yAxis;
  }

  // Updating circles function
  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  // New text transition function
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
      
  return circletextGroup;
}

// Tooltip update function
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // Selection of X axis
  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age"
  }
  else {
    var xlabel = "Median Income"
  }
  // Selection of Y axis
  if (chosenYAxis === "smokes") {
    var ylabel = "Smokers"
  }
  else if (chosenYAxis === "healthcare") {
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
      if (chosenXAxis === "age") {
          // All yAxis tooltip labels presented and formated as %.
          // Display Age without format for xAxis.
          return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
        } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
          // Display Income in dollars for xAxis.
          return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
        } else {
          // Display Poverty as percentage for xAxis.
          return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
        }      
  });

  circlesGroup.call(toolTip);
  //mouseon event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
  //mouseout event
   .on("mouseout", function(data,index) {
    toolTip.hide(data)
  });

return circlesGroup;
}


// Import Data
d3.csv("/assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.income = +data.income;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // Step 2: xlinear scale function above csv import
    // ==============================
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);


    // Step 3: Create xy axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

      
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    // Add State abbr. text to circles. and some offset to y
    var circletextGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
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
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // X Axis labels event listener.
    labelsGroup.selectAll("text")
        .on("click", function() {
        // Get value of selection.
          var value = d3.select(this).attr("value");
          console.log(value)

        //if select x axises
          if (true) {
              if (value === "poverty" || value === "age" || value === "income") {
                // Replaces chosenXAxis with value.
                chosenXAxis = value;

                // Update x scale for new data.
                xLinearScale = xScale(healthData, chosenXAxis);

                // Updates x axis with transition.
                xAxis = renderXAxes(xLinearScale, xAxis);

                // Update circles with new x values.
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // Update tool tips with new info.
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // Update circles text with new values.
                circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // Changes classes to change bold text.
                if (chosenXAxis === "poverty") {
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
                else if (chosenXAxis === "age"){
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
                    chosenYAxis = value;
                    //console.log("you choosed y axis")
              
                    // Update y scale for new data.
                    yLinearScale = yScale(healthData, chosenYAxis);

                    // Updates y axis with transition.
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // Update circles with new x values.
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // Update tool tips with new info.
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // Update circles text with new values.
                    circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // Changes classes to change bold text.
                    if (chosenYAxis === "healthcare") {

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
                    else if (chosenYAxis === "smokes"){
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