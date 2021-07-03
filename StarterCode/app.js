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

// Set up axes
let chosenXAxis = "Poverty";
let chosenYAxis = "Healthcare";

var xAxisLabels = ["Poverty", "Age", "Income"];  // Default 
var yAxisLabels = ["Obesity", "Smokes", "Healthcare"];
var labelsTitle = { "Poverty": "In Poverty (%)", 
                    "Age": "Age (Median)", 
                    "Income": "Household Income (Median)",
                    "Obesity": "Obese (%)", 
                    "Smokes": "Smokes (%)", 
                    "Healthcare": "Lacks Healthcare (%)" };

function xScale(healthData,chosenXAxis){
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenXAxis])*0.9, d3.max(healthData,d=>d[chosenXAxis])*1.1])
      .range([0,width])
  return xLinearScale;

}