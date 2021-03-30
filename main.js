// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

var DATA;

let filename = "../data/video_games.csv"

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 300;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;


// Create our graph objects
let graph1 = d3.select("#graph1").append("svg")
        .attr("width", graph_1_width)
        .attr("height", graph_1_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

let graph2 = d3.select("#graph2").append("svg")
        .attr("width", graph_2_width)
        .attr("height", graph_2_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
let graph3 = d3.select("#graph3").append("svg")
        .attr("width", graph_3_width + margin.left + margin.right)
        .attr("height", graph_3_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


var year_dropdown = document.getElementById("years")
year_dropdown.addEventListener("change", update_year);

var genre_dropdown = document.getElementById("genre")
genre_dropdown.addEventListener("change", update_genre);

// Render our graphs and declare a global DATA var.
// Though DATA is a var, we never want to mutate
d3.csv(filename).then(function(data) {
        DATA = data;
        create_dropdown("Year", year_dropdown);
        create_dropdown("Genre", genre_dropdown);
        create_graph1({});
        create_graph2({});
        create_graph3({});
});


// Dynamically create our dropdowns for all options of a field
function create_dropdown(field, dropdown) {
        var s = new Set();
        DATA.forEach(element => s.add(element[field]))
        s = Array.from(s)
        s.sort()
        s.forEach(y => add_to_dropdown(y, dropdown))
}

// Add element to a dropdown
function add_to_dropdown(y, dropdown) {
        var option = document.createElement('option');
        option.text = option.value = y;
        dropdown.add(option)
}


// Event listener for year dropdown
function update_year(event) {
        if (year_dropdown.value == '') {
                create_graph1({'Year': null});
                return
        }
        create_graph1({'Year': year_dropdown.value})
}

// Event listener for genre dropdown.
function update_genre(event) {
        if (genre_dropdown.value == '') {
                create_graph3({'Genre': null});
                return
        }
        create_graph3({'Genre': genre_dropdown.value})
}