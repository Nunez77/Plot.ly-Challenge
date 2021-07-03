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

