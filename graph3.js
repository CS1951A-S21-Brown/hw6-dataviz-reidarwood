let x3 = d3.scaleLinear()
            .range([0, graph_3_width - margin.right - margin.left]);

let y3 = d3.scaleBand()
            .range([0, graph_3_height - margin.top - margin.bottom])
            .padding(0.1);


// let NUM_EXAMPLES = 10;


let countRef3 = graph3.append("g");

// Set up reference to y axis label to update text in setData
let y_axis_label3 = graph3.append("g");

let x_axis_label3 = graph3.append("text")
    .attr("transform", `translate(${graph_3_width/2 - margin.right}, ${graph_3_height-margin.top - margin.bottom/2})`)
    .style("text-anchor", "middle")
    .text("Average Sales (in Millions)");

let y_axis_text3 = graph3.append("text")
    .attr("transform", `translate(${0 - 2 * margin.left/4}, ${-margin.top/4})`)
    .style("text-anchor", "middle").text("Publisher");

let title3 = graph3.append("text")
    .attr("transform", `translate(${graph_3_width/2 - margin.right}, ${-margin.top/4})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);


function create_graph3(args) {
    d3.select("#graph3").selectAll("rect").remove();

    var data = DATA;
    title3.text(`Top Publisher`)
    
    if (args["Genre"]) {
        console.log("here")
        data = data.filter((d) => {return d.Genre == args["Genre"]})
        title3.text(`Top Publisher (${args["Genre"]})`)
    }

    // var locations = data.columns.slice(1).slice(5, 9)
    data = getTopPublishers(data, NUM_EXAMPLES)

    var publishers = d3.map(data, function(d){return(d.Publisher)}).keys()
    let max_val = d3.max(data, function(d) {return d.Average})
    y3.domain(publishers)
    x3.domain([0, max_val])

    y_axis_label3.call(d3.axisLeft(y3).tickSize(0).tickPadding(10));

    var color = d3.scaleOrdinal()
        .domain(publishers)
        .range(d3.quantize(d3.interpolateHcl("#00ff00", "#ff0000"), NUM_EXAMPLES))


    const bars = graph3.append('g')
        .selectAll('rect')
        .data(data);

    bars.enter().append("rect")
        .attr("x", function(d) { return x3(0);})
        .attr("y", function(d) { return y3(d.Publisher)})
        .attr("width", function(d) {return x3(d.Average)})
        .attr("height", y3.bandwidth())
        .style("fill", function(d) {return color(d.Publisher)});

    let counts = countRef3.selectAll("text").data(data);
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) {return x3(d.Average) + 8 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) {return y3(d.Publisher) + y3.bandwidth()/1.5 })       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) {return Math.round(d.Average* 100)/100});
}


function getTopPublishers(data, num_examples) {
    let publisher = {}

    const arrSum = arr => arr.reduce((a,b) => a + b, 0)

    data.forEach(element => {
        if (element.Publisher in publisher) {
            publisher[element.Publisher].push(parseFloat(element.Global_Sales))
        } else {
            publisher[element.Publisher] = [parseFloat(element.Global_Sales)]
        }
    });
    var tmp = []

    for (const p in publisher) {
        tmp.push({
            "Publisher" : p,
            "Average": arrSum(publisher[p]) / publisher[p].length
        })
    }
    tmp.sort((a,b) => b.Average - a.Average)

    
    return tmp.slice(0,num_examples);
}