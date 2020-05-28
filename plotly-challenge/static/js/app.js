//read in the data 
d3.json("samples.json").then((data) => {
    // console.log(data);
    var selector=d3.select('#selDataset');
    var sampleNames=data.names;
    console.log(sampleNames);
    sampleNames.forEach((name)=>{
        selector.append('option')
                .property('value', name)
                .text(name);
    });
buildChart(sampleNames[0]);
demographicData(sampleNames[0]);

});

function buildChart(selection) {
    d3.json('samples.json').then((data)=>{
        var samples=data.samples;
        var filterSubject = samples.filter(sample=>sample.id==selection)[0];
        //var sample_values=filterSubject.sample_values.slice(0,10)
        //                    .sort(function compareFunction(firstNum, secondNum) {
        //                       return firstNum - secondNum;
        //});
        var sample_values=filterSubject.sample_values.slice(0, 10).reverse();
        var otu_ids=filterSubject.otu_ids.slice(0, 10).reverse();
        var otu_labels=filterSubject.otu_labels

        var sample_values_bubble = filterSubject.sample_values
        var otu_ids_bubble = filterSubject.otu_ids
       
        var barTrace={
            y: otu_ids.map(id=>`OTU ${id}`), 
            x: sample_values,
            type: 'bar', 
            orientation: 'h'
        }
        
        var barLayout={
            title: `Bacteria Cultures Found in ${selection}`
        }

        Plotly.newPlot('bar', [barTrace], barLayout);

        var bubbleTrace = {
            x: otu_ids_bubble,
            y: sample_values_bubble,
            mode: 'markers',
            text: otu_labels,
            marker: {
                color: otu_ids_bubble,
                size: sample_values_bubble.map(sample_value=>sample_value*.6), 
                colorscale: 'Earth'
            }
        }

        var bubbleLayout={
            xaxis: {title: "OTU ID"}
        }

        Plotly.newPlot('bubble', [bubbleTrace])
    });   
};

function demographicData(selection) {
    d3.json('samples.json').then((data)=>{
        var metadata = data.metadata;
        var filterMetadata = metadata.filter(meta=>meta.id==selection)[0];
        var keys = Object.keys(filterMetadata)
        var metaSelector = d3.select('#sample-metadata');
        
        console.log(keys);
        console.log(filterMetadata);
        metaSelector.html('');
        // metaSelector.append('ul').style('list-style-type: none;')
        keys.forEach((key) => {
            metaSelector.append('h6')
                        .text(`${key}: ${filterMetadata[key]}`)
        });             
    });
};


function optionChanged(selectedSample) {
    console.log(selectedSample);
    buildChart(selectedSample);
    demographicData(selectedSample);
};