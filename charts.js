function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing data
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Step 1 buildCharts function.
function buildCharts(sample) {
  
  // Step 2 provide code to retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    
    // Step 3 create a variable that has the array for all the samples 
    let allSamples = data.samples;
    let filteredSample = allSamples.filter(sampleObj =>sampleObj.id ==sample);
    let selectedSample = filteredSample[0];
    console.log(selectedSample);
    
    // Step 4,5,6 Create variables that hold the otu_ids, otu_labels, and sample_values
    let otuIDarray = selectedSample.otu_ids;
    console.log(otuIDarray)
    let otuLabelArray = selectedSample.otu_labels;
    console.log(otuLabelArray)
    let sampleValuesArray = selectedSample.sample_values;
    console.log(sampleValuesArray)

    // Deliverable 1: Create a Horizontal Bar Chart
    
    // Stpe 7 Create the yticks for the bar chart
    let yticks = otuIDarray.slice(0,10).map(id=>`OTU ${id}`).reverse();
    
    // Create the trace for the bar chart. 
    let barData = [{
      x: sampleValuesArray.slice(0,10).reverse(),
      text: otuLabelArray.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValuesArray,
        colorscale: "Earth",
        }
    }];
    
    // Create the layout for the bar chart. 
    let barLayout = {
      title: {
        text: "Top 10 Bacterial Cultures Found",
        marker: { size: 12, color: "850000" },
        //margin: { t: 30, l: 150 }
      }
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: Create a Bubble Chart
    
    // Create the trace for the bubble chart.   
    let bubbleData = [{
      x: otuIDarray,
      y: sampleValuesArray,
      text: otuIDarray.map(id=>`OTU ${id}`),
      mode: 'markers',
      marker: { 
        size: sampleValuesArray,
        color: otuIDarray,
        colorscale: "Earth" }
    }];
    
    // Create the layout for the bubble chart.
    let bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per Sample",
        marker: { size: 12, color: "850000" },
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: Create a Gauge Chart
    
    let filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredMeta);
    let selectedMeta = filteredMeta[0]; 
    console.log(selectedMeta);
    
    washFreq = selectedMeta.wfreq;
    console.log(washFreq);

    var gaugeData = [{
      value: washFreq,
      title: {
        text: "Belly Button Washing Frequency<br>Scrubs per Week<br>",
        marker: { size: 12, color: "850000" },
        x: [0],
        y: [0],
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "Earth"},
        steps: [
          {range: [0,1], color: "rgba(0, 105, 11, .5)"},
          {range: [1,2], color: "rgba(10, 120, 22,.5)"},
          {range: [2,3], color: "rgba(14, 107, 0, .5)"},
          {range: [3,4], color: "rgba(110, 105, 11, .5)"},
          {range: [4,5], color: "rgba(170, 202, 42, .5)"}, 
          {range: [5,6], color: "rgba(202, 209, 95, .5)"},
          {range: [6,7], color: "rgba(210, 206, 145, .5)"},
          {range: [7,8], color: "rgba(232, 226, 202, .5)"},
          {range: [8,9], color: "rgba(240, 230, 215, .5)"},
          {range: [9,10], color: "rgba(255, 255, 255, .0)"},         
        ]
      }
    }];
    
    var gaugeLayout = { 
      width: 400,
      height: 300,
      margin: {t:60, r:25, l:15, b:0}   
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}