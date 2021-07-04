// Create a horizontal bar chart with a dropdown menu
// to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.


// Read data from file
d3.json("samples.json").then((data) => {

    // Initialize arrays
    var values = [];
    var otu_ids = [];
    var otu_labels = [];
    var ids = [];

    // Sort the samples dataset by sample values
    var sortedValues = data.samples.sort((a,b) => b.sample_values - a.sample_values);
    console.log(sortedValues);

    // Slice the samples dataset into the top 10 values
    var slicedData = sortedValues.slice(0,10);
    console.log(slicedData);

    // IDS: EACH PERSON
    // Create two arrays for ids
    ids = sortedValues.map(d => d.id);
    console.log("---IDs---");
    console.log(ids);

    // SAMPLE VALUES: EACH SAMPLE
    // Create two arrays for values
    values = sortedValues.map(d => d.sample_values);
    top_10_values = sortedValues.map(d => d.sample_values.slice(0,10).reverse());
    console.log("---TOP 10 Values---");
    console.log(top_10_values[0]);

    // OTU IDS: EACH SAMPLE
    // Create two arrays for otu ids
    otu_ids = sortedValues.map(d => d.otu_ids);
    top_10_otu_ids = sortedValues.map(d => d.otu_ids.slice(0,10).reverse());
    console.log("---TOP 10 OTU IDs---");
    console.log(top_10_otu_ids[0]);

    // Initialize the string array for otu ids
    var string_otu_ids = [];
    
    // Function to convert numbers to string 
    function convertToString(x) {
        return `OTU ${String(x)}`;
    }

    // Loop through to convert int ids to strings (with OTU at beginning)
    for (var i = 0; i < top_10_otu_ids.length; i++) {
        string_otu_ids[i] = top_10_otu_ids[i].map(convertToString);
    };

    // STRING OTU IDS: EACH SAMPLE
    // Check string OTU ID array
    console.log("---TOP 10 String OTU IDs---");
    console.log(string_otu_ids[0]);

    // OTU LABELS: EACH SAMPLE
    // Create two arrays for otu labels
    otu_labels = sortedValues.map(d => d.otu_labels);
    top_10_otu_labels = sortedValues.map(d => d.otu_labels.slice(0,10).reverse());
    console.log("---TOP 10 OTU Labels---");
    console.log(top_10_otu_labels[0]);

    // METADATA DEMOGRAPHICS
    // Bring in the metadata object
    var metadata = data.metadata;
    // console.log(metadata);

    // Define the id array
    var individual_id = metadata.map(d => d.id);
    // console.log(individual_id);

    // Define the ethnicity array
    var ethnicity = metadata.map(d => d.ethnicity);
    // console.log(ethnicity);

    // Define the gender array
    var gender = metadata.map(d => d.gender);
    // console.log(gender);

    // Define the age array
    var age = metadata.map(d => d.age);
    // console.log(age);

    // Define the location array
    var location = metadata.map(d => d.location);
    // console.log(location);
    
    // Define the bbtype array
    var bbtype = metadata.map(d => d.bbtype);
    // console.log(bbtype);

    // Define the wfreq array
    var wfreq = metadata.map(d => d.wfreq);
    // console.log(wfreq);

    // DEMOGRAPHIC CARD
    // Select the card location
    card_list = d3.select("#list-group");
    
    // Append a list option with each demographic value
    card_list.append("li").text(`ID: ${individual_id[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Ethnicity: ${ethnicity[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Gender: ${gender[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Age: ${age[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Location: ${location[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Bellybutton Type: ${bbtype[0]}`).attr("class", "list-group-item");
    card_list.append("li").text(`Wash Frequency: ${wfreq[0]}`).attr("class", "list-group-item");

    // Initialize the graph when loaded with default data
    function init() {
    
        
        // Bar Plot trace
        var trace1 = [{
            x: top_10_values[0],
            y: string_otu_ids[0],
            hovertext: top_10_otu_labels[0],
            type: "bar",
            orientation: "h",
            ids: string_otu_ids[0],
            marker: { color: `rgb(78, 116, 125)` }
        }];

        // Bar Plot layout
        var layout1 = {
            title: "Top 10 OTUs Found in Test Subject",
            xaxis: {
                title: "Sample Values"
            },
            yaxis: {
                // title: "OTU IDs",
                type: "category"
            }
        };

        // Bubble Plot trace
        var trace2 = [{
            x: otu_ids[0],
            y: values[0],
            hovertext: otu_labels[0],
            mode: 'markers',
            marker: {
                color: otu_ids[0],
                size: values[0]
            }
        }];
        
        // Bubble plot layout
        var layout2 = {
            title: "Number of OTUs per Sample",
            showlegend: false,
            // height: 600,
            // width: 1200,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values",
                //type: "category"
            }
        };
        
        // Indicator Plot trace
        var trace3 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq[0],
                title: "Wash Frequency<br><span style='font-size:0.8em;color:gray'>Number of Bellybutton Scrubs<br>per Week</span>", // { text: "Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                // delta: { reference: 3 },
                gauge: {
                    bar: { color: '#518290'},  
                    axis: { range: [0, 9] },
                    steps: [
                        { range: [0, 1], color: '#F2F7F8'},
                        { range: [1, 2], color: '#E5EEF0'},
                        { range: [2, 3], color: '#D8E6E9'},
                        { range: [3, 4], color: '#CBDDE2'},
                        { range: [4, 5], color: '#BED5DA'},
                        { range: [5, 6], color: '#B1CCD3'},
                        { range: [6, 7], color: '#9BBEC7'},
                        { range: [7, 8], color: '#89B3BD'},
                        { range: [8, 9], color: '#7CAAB6'}
                    
                    ],
                    threshold: {
                        line: { color: "#33535B" , width: 4 }, //'rgb(239, 203, 104)'
                        thickness: 0.75,
                        value: wfreq[0]
                    }
                }
            }
        ];
        
        // Indicator Layout
        var layout3 = { margin: { t: 100, b: 100 } };
        // var layout3 = { width: 500, height: 300, margin: { t: 0, b: 0 } };

        var config = { responsive: true };
        
        // Define where the plots will live
        var bar_plot = d3.selectAll("#bar-plot").node();
        var bubble_plot = d3.selectAll("#bubble-plot").node();
        var indicator_plot = d3.selectAll("#indicator-plot").node();

        // Plot the plots
        Plotly.newPlot(bar_plot, trace1, layout1, config);
        Plotly.newPlot(bubble_plot, trace2, layout2, config);
        Plotly.newPlot(indicator_plot, trace3, layout3, config);
    
    };

    // DROPDOWN MENU
    // Select the dropdown menu
    var dropdownMenu = d3.select("#dropdown-menu>#selID");
    
    // Loop through ids and create options in dropdown menu
    for (var x = 0; x < ids.length; x++) {
        var option = dropdownMenu.append("option");
        option.text(ids[x]).attr("value", `${ids[x]}`);
    };

    // When the page is changed, update the plot
    d3.selectAll("select").on("change", updatePlotly);

    

// Function when a dropdown option is chosen
function updatePlotly() {
    var dataset = dropdownMenu.node().value;
    console.log(dataset);

    // Loop through ids to create cases (when each dataset is chosen)
    for (var i = 0; i < ids.length; i++) {
        switch(dataset) {
            case ids[i]:
                // Variables to change for Bar Plot
                x = top_10_values[i];
                y = string_otu_ids[i];
                text = top_10_otu_labels[i];

                // Variables to change for Bubble Plot
                x2 = otu_ids[i];
                y2 = values[i];
                text2 = otu_labels[i];

                // Variables to change for Indicator Plot
                value = wfreq[i];
                break;
        };
    };

    // Loop through to change the demographic card
    for (var i = 0; i < individual_id.length; i++) {
        // if the dataset chosen is equal to the ID
        if (dataset == individual_id[i]) {
            // Set the ID iteration to a variable
            var thisID = i;

        // DEMOGRAPHIC CARD
        // Select the card location
        card_list = d3.select("#list-group");

        // Clear the demograhic card
        card_list.html("");
        
        // Append a list option with each demographic value
        card_list.append("li").text(`ID: ${individual_id[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Ethnicity: ${ethnicity[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Gender: ${gender[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Age: ${age[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Location: ${location[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Bellybutton Type: ${bbtype[thisID]}`).attr("class", "list-group-item");
        card_list.append("li").text(`Wash Frequency: ${wfreq[thisID]}`).attr("class", "list-group-item");
        };
    
    };

    // Select the location of each plot
    var bar_plot = d3.selectAll("#bar-plot").node();
    var bubble_plot = d3.selectAll("#bubble-plot").node();
    var indicator_plot = d3.selectAll("#indicator-plot").node();

    // Restyle the bar plot with new data
    Plotly.restyle(bar_plot, "x", [x]);
    Plotly.restyle(bar_plot, "y", [y]);
    Plotly.restyle(bar_plot, "hovertext", [text]);

    // Restyle the bubble plot with new data
    Plotly.restyle(bubble_plot, "x", [x2]);
    Plotly.restyle(bubble_plot, "y", [y2]);
    Plotly.restyle(bubble_plot, "hovertext", [text2]);

    // Restyle the indicator plot with new data
    Plotly.restyle(indicator_plot, "value", [value]);
    Plotly.restyle(indicator_plot, "gauge.threshold.value", [value]);

};

// Call the default plot
init();

});
