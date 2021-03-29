let x2 = d3.scaleBand()
            .range([0, graph_2_width])
            .padding(0.1);
let y2 = d3.scaleBand()
            .range([0, graph_2_height])
            .padding(0.1);

function create_graph2() {
    var data = parseDataByRegion(DATA)

    // Find max value for one genre over all locations
    let MAX = d3.max(Object.values(data), d => d3.max(Object.values(d)))
    
    var myColor = d3.scaleLinear()
        .range(["#c5e0da", "#00b08a"])
        .domain([0,MAX])

    x2.domain(Object.keys(data))
    graph2.append("g")
        .attr("transform", "translate(0," + graph_2_height + ")")
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
        console.log(d3.mouse(this))
      tooltip
        .html("Sales: " + d.value + " Million")
        .style("left", (d3.mouse(this)[0] + 70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      tooltip.style("opacity", 0)
    }

    data = flatten_data(data)
    console.log(data)
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

function flatten_data(data) {
    var flattened_data = []
    keys1 = Object.keys(data)
    keys2 = Object.keys(data["North America"])
    // console.log(keys2)
    keys1.forEach((k1) => keys2.forEach((k2) => {
        let data_point = {
            "region": k1,
            "genre": k2,
            "value": data[k1][k2]
        }
        flattened_data.push(data_point)
    }))
    // console.log(flattened_data)
    return flattened_data
}

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
            data_by_region["North America"][genre] += parseInt(element.NA_Sales)
            data_by_region["Japan"][genre] += parseInt(element.JP_Sales)
            data_by_region["Europe"][genre] += parseInt(element.EU_Sales)
            data_by_region["Other"][genre] += parseInt(element.Other_Sales)
        } else {
            data_by_region["North America"][genre] = parseInt(element.NA_Sales)
            data_by_region["Japan"][genre] = parseInt(element.JP_Sales)
            data_by_region["Europe"][genre] = parseInt(element.EU_Sales)
            data_by_region["Other"][genre] = parseInt(element.Other_Sales)
        }
    });
    return data_by_region;
}