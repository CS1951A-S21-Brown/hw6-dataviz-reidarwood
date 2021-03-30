// reate scales
let x1 = d3.scaleLinear()
            .range([0, graph_1_width - margin.right - margin.left]);

let y1 = d3.scaleBand()
            .range([0, graph_1_height - margin.top - margin.bottom])
            .padding(0.1);


let NUM_EXAMPLES = 10;


let countRef1 = graph1.append("g");

// Set up reference for labels
let y_axis_label1 = graph1.append("g");

let x_axis_label1 = graph1.append("text")
    .attr("transform", `translate(${graph_1_width/2 - margin.right}, ${graph_1_height-margin.top - margin.bottom/2})`)
    .style("text-anchor", "middle")
    .text("Sales (in Millions)");

let y_axis_text1 = graph1.append("text")
    .attr("transform", `translate(${0 - 2 * margin.left/4}, ${-margin.top/4})`)
    .style("text-anchor", "middle").text("Games");

// Title is dynamic so dont define text
let title1 = graph1.append("text")
    .attr("transform", `translate(${graph_1_width/2 - margin.right}, ${-margin.top/4})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

// create our chart
function create_graph1(args) {
    // Remove the bars from previous chart so that blank canvas
    d3.select("#graph1").selectAll("rect").remove()

    var data = DATA;

    // Set text to "Global sales"
    title1.text(`Global Sales`)

    // If year parameter filter data, and update title again
    if (args["Year"]) {
        data = data.filter((d) => {return d.Year == args["Year"]})
        title1.text(`Global Sales (${args["Year"]})`)
    }

    // Clean data using function
    data = cleanData(data, (a, b) => {return parseFloat(b['Global_Sales']) - parseFloat(a['Global_Sales'])}, NUM_EXAMPLES)
    
    // Create scales based on the data
    var games = d3.map(data, function(d){return(d.Name)}).keys()
    let max_val = d3.max(data, function(d) {return parseFloat(d['Global_Sales'])})
    y1.domain(games)
    x1.domain([0, max_val])
    
    // Create color scale
    var color = d3.scaleOrdinal()
        .domain(games)
        .range(d3.quantize(d3.interpolateHcl("#479dff", "#81c2c3"), NUM_EXAMPLES))


    // Make bars
    const bars = graph1.append('g')
        .selectAll('rect')
        .data(data);
    
    bars.enter().append("rect")
                .attr("x", function(d) { return x1(0);})
                .attr("y", function(d) { return y1(d.Name)})
                .attr("width", function(d) {return x1(d.Global_Sales)})
                .attr("height", y1.bandwidth())
                .style("fill", function(d) {return color(d.Name)});

    // Label the text
    let counts = countRef1.selectAll("text").data(data);
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {return x1(d.Global_Sales) + 8 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) {return y1(d.Name) + y1.bandwidth()/1.5 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) {return d.Global_Sales});

    // Create y axis
    y_axis_label1.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));
    // Remove counts on update
    counts.exit().remove()
}

// Function to clean data by sorting by comparator and then
// returning top num_examples
function cleanData(data, comp, num_examples) {
    data.sort(comp)
    var tmp = data.slice(0, num_examples);

    return tmp;
}