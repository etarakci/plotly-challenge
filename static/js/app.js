function createDropdown() {
  d3.json("data/samples.json").then(response => {
    var selector = d3.select("select");
    var dropdownData = response.names;
    console.log(dropdownData);

    // DROPDOWN MENU
    dropdownData.forEach(id => {
      console.log(id);
      
      
      selector.append("option")
      .text(id)
      .attr("value", id);
    });
  });
};

function buildPlots(sampleID) {
  d3.json("data/samples.json").then(response => {

    var sample = response.samples.filter(sample => sample.id === sampleID)[0]; 
    
    // BAR PLOT 
    var barTrace = {
        x: sample.sample_values.slice(0,10).reverse(), // sample_values
        y: sample.otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(), //otu_ids (hover text = otu_labels)
        text: sample.otu_labels.slice(0,10).reverse(),
        // name: "Samples",
        type: "bar",
        orientation: 'h'
      };
    // console.log(trace.x);

    var barData = [barTrace];
    var barLayout = {
        title: "Samples",
        barmode: "group"
      };
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", barData, barLayout);

    // BUBBLE PLOT
  
    var bubbleTrace = {
      x: sample.otu_ids, // sample_values
      y: sample.sample_values, //otu_ids (hover text = otu_labels)
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };
  
    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
        title: "Samples",
        // barmode: "group"
      };
      
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // DISPLAY DEMOGRAPHICS
    var dem = d3.select("#sample-metadata")
    var metadata = response.metadata.filter(sample => sample.id == sampleID);
    console.log(metadata);
    dem.html("");
    Object.entries(metadata[0]).forEach(([key,value]) => {
      dem.append("h6").text(`${key}: ${value}`);
    });
      
  });
};


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var subject = dropdownMenu.property("value");
  buildPlots(subject);
};


function init() {
  createDropdown();
  buildPlots("940");
};

init();