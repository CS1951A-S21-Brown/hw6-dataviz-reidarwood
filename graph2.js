// create scale
let x2 = d3.scaleBand()
            .range([0, graph_2_width - margin.right - margin.top])
            .padding(0.1);
let y2 = d3.scaleBand()
            .range([0, graph_2_height - margin.top - margin.bottom])
            .padding(0.1);

// Create explanatory title
let title2 = graph2.append("text")
            .attr("transform", `translate(${graph_2_width/2 - margin.right}, ${-margin.top/4})`)
            .style("text-anchor", "middle")
            .style("font-size", 15).text("Genre Sales by Location");

function create_graph2() {
    var data = parseDataByRegion(DATA)

    // Find max value for one genre over all locations
    let MAX = d3.max(Object.values(data), d => d3.max(Object.values(d)))
    
    // Color based on how many sales. Darker means more sales
    var myColor = d3.scaleLinear()
        .range(["#c5e0da", "#00b08a"])
        .domain([0,MAX])

    // Created x and y axes
    x2.domain(Object.keys(data))
    graph2.append("g")
        .attr("transform", "translate(0," + (graph_2_height - margin.bottom - margin.top) + ")")
        .call(d3.axisBottom(x2))

    y2.domain(Object.keys(data["North America"]))
    graph2.append("g")
        .call(d3.axisLeft(y2));

    // create a tooltip
    var tooltip = d3.select("#graph2")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
      tooltip
        .html("Sales: " + ((Math.round(d.value))/100) + " Million")
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      tooltip.style("opacity", 0)
    }
    //Flatten and then created heatmap
    data = flatten_data(data)
    graph2.selectAll()
        .data(data).enter().append('rect')
        .attr("x", function(d) { return x2(d["region"]) })
        .attr("y", function(d) { return y2(d["genre"]) })
        .attr("width", x2.bandwidth() )
        .attr("height", y2.bandwidth() )
        .style("fill", function(d) { return myColor(d["value"])})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
}

// Function to turn our nested objects into
// an array of objects for D3
function flatten_data(data) {
    var flattened_data = []
    keys1 = Object.keys(data)
    keys2 = Object.keys(data["North America"])
    
    keys1.forEach((k1) => keys2.forEach((k2) => {
        let data_point = {
            "region": k1,
            "genre": k2,
            "value": data[k1][k2]
        }
        flattened_data.push(data_point)
    }))

    return flattened_data
}


// Get the total sales in each genre for each region.
function parseDataByRegion(data) {
    var data_by_region = {
                        "North America": {},
                        "Japan": {},
                        "Europe": {},
                        "Other": {}
                     }
    data.forEach(element => {
        var genre = element.Genre
        if (data_by_region["North America"][genre]) {
            data_by_region["North America"][genre] += parseFloat(element.NA_Sales)
            data_by_region["Japan"][genre] += parseFloat(element.JP_Sales)
            data_by_region["Europe"][genre] += parseFloat(element.EU_Sales)
            data_by_region["Other"][genre] += parseFloat(element.Other_Sales)
        } else {
            data_by_region["North America"][genre] = parseFloat(element.NA_Sales)
            data_by_region["Japan"][genre] = parseFloat(element.JP_Sales)
            data_by_region["Europe"][genre] = parseFloat(element.EU_Sales)
            data_by_region["Other"][genre] = parseFloat(element.Other_Sales)
        }
    });
    return data_by_region;
}