// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

var DATA;

filename = "../data/video_games.csv"

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let graph1 = d3.select("#graph1").append("svg")
        .attr("width", graph_1_width + margin.left + margin.right)
        .attr("height", graph_1_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
let graph2 = d3.select("#graph2").append("svg")
        .attr("width", graph_1_width + margin.left + margin.right)
        .attr("height", graph_1_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
let graph3 = d3.select("#graph3").append("svg")
        .attr("width", graph_1_width + margin.left + margin.right)
        .attr("height", graph_1_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Render our graphs and declare a global DATA var.
// Though DATA is a var, we never want to mutate
d3.csv(filename).then(function(data) {
        DATA = data;
        create_graph1({});
        create_graph2({});
        create_graph3({});
})