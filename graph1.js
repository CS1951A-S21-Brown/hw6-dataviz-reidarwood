let x1 = d3.scaleLinear()
            .range([0, graph_1_width]);

let y1 = d3.scaleBand()
            .range([0, graph_1_height])
            .padding(0.1);


let NUM_EXAMPLES = 10;


let countRef1 = graph1.append("g");

// Set up reference to y axis label to update text in setData
let y_axis_label1 = graph1.append("g");

let x_axis_label1 = graph1.append("text")
    .attr("transform", `translate(${graph_1_width/2}, ${graph_1_height +  margin.bottom})`)
    .style("text-anchor", "middle")
    .text("Sales");

let y_axis_text1 = graph1.append("text")
    .attr("transform", `translate(${0 - 3 * margin.left/4}, ${graph_1_height/2})`)
    .style("text-anchor", "middle");

let title1 = graph1.append("text")
    .attr("transform", `translate(${graph_1_width/2}, ${-margin.top/4})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

function create_graph1(args) {
    var data = DATA;
    var locations = data.columns.slice(1).slice(5, 9)
    if (args["Year"]) {
        data = data.filter((d) => {return d.Year == args["Year"]})
    }
    
    data = cleanData(data, (a, b) => {return parseInt(b['Global_Sales']) - parseInt(a['Global_Sales'])}, NUM_EXAMPLES)
    // console.log(data)
    //Get list of locations
    

    //Get list of games
    var games = d3.map(data, function(d){return(d.Name)}).keys()
    let max_val = d3.max(data, function(d) {return parseInt(d['Global_Sales'])})
    y1.domain(games)
    x1.domain([0, max_val])

    var stackedData = d3.stack().keys(locations)(data)
    
    var color = d3.scaleOrdinal()
        .domain(locations)
        .range(["#6C91C2", "#FF9F1C", "#C44536", "#3DFAFF"])

    // console.log(color.range())
    // console.log(color.domain())

    const elements = graph1.append('g')
                .selectAll('g')
                .data(stackedData)
    elements.enter().append('g')
                .attr("fill", function(d) { return color(d.key)})
                .selectAll('rect').data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("x", function(d) { return x1(d[0]);})
                .attr("y", function(d) { return y1(d.data.Name)})
                .attr("width", function(d) {return x1(d[1] - d[0])})
                .attr("height", y1.bandwidth());

    y_axis_label1.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));
    title1.text("Best Selling Video Games")
    // graph1.selectAll('rect').data(stackedData).exit().remove()
    elements.exit().remove()
}


function cleanData(data, comp, num_examples) {
    data.sort(comp)
    
    return data.slice(0,num_examples)
}