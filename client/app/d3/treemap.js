var createTreeMap = function(keywords) {

////////////////////////////////////////////////////////////////////
// Refactor keywords data for use in treemap
////////////////////////////////////////////////////////////////////

  // Setup object to hold data in proper formatting for treemap
  var treeMapData = {
    "name": "master",
    "children": [
      {"name": "neutral", "children": []},
      {"name": "positive", "children": []},
      {"name": "negative", "children": []}
    ]
  };

  // Map keyword 'name' to sentiment as new data structure doesn't hold sentiment
  var keywordToSentiment = {};

  // Add keywords to treeMapData and map keywordToSentiment
  for (keyword in keywords) {
    var name = keywords[keyword].text;
    if (!keywords[keyword].sentiment.score) {
      keywordToSentiment[name] = '0';
      treeMapData["children"][0]["children"].push({'name': name, 'size': keywords[keyword].relevance});
    }
    else if (keywords[keyword].sentiment.score > 0) {
      treeMapData["children"][1]["children"].push({'name': name, 'size': keywords[keyword].relevance});
    }
    else if (keywords[keyword].sentiment.score < 0) {
      treeMapData["children"][2]["children"].push({'name': name, 'size': keywords[keyword].relevance});
    }
    keywordToSentiment[name] = keywordToSentiment[name] || keywords[keyword].sentiment.score;
  };

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  // Remove previous D3 animation from #animation div
  d3.select("#animation").selectAll("svg").remove();
  d3.select("#animation").selectAll("div").remove();

  // Set margin and dimensions according to #animation dimensions
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = document.getElementById('animation').offsetWidth - margin.left - margin.right,
      height = document.getElementById('animation').offsetHeight - margin.top - margin.bottom;

  // Set color to match sentiment, red - silver - green
  var color = d3.scale.linear()
    .domain([-1,0,1])
    .range(["#BD0000","#D3F3EE","#009F00"]);
 
  // Create treemap
  var treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });

  // Create div for treemap and append to #animation  
  var div = d3.select("#animation").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  var node = div.datum(treeMapData).selectAll(".node")
    .data(treemap.nodes)
  .enter().append("div")
    .attr("class", "node")
    .call(position)
    // Set color by looking up d.name in keywordToSentiment
    .style("background", function(d) { return color(keywordToSentiment[d.name]);})
    .text(function(d) { return d.children ? null : d.name; });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
};