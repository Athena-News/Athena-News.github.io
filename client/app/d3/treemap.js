var createTreeMap = function(keywords) {

////////////////////////////////////////////////////////////////////
// START Parse keywords into treeMapData and map keywordToSentiment
////////////////////////////////////////////////////////////////////
  var treeMapData = {
    "name": "master",
    "children": [
      {"name": "neutral", "children": []},
      {"name": "positive", "children": []},
      {"name": "negative", "children": []}
    ]
  };

  var keywordToSentiment = {};

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
// END Parse keywords into treeMapData and map keywordToSentiment
////////////////////////////////////////////////////////////////////

  d3.select("#animation").selectAll("svg").remove()

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = document.getElementById('animation').offsetWidth - margin.left - margin.right,
      height = document.getElementById('animation').offsetHeight - margin.top - margin.bottom;

  var color = d3.scale.linear()
    .domain([-1,0,1])
    .range(["#BD0000","#D3F3EE","#009F00"]);
 
  var treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });

  // not using SVG but keeping name for consistency    
  var svg = d3.select("#animation").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  var node = svg.datum(treeMapData).selectAll(".node")
    .data(treemap.nodes)
  .enter().append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function(d) { return color(keywordToSentiment[d.name]);})
    .text(function(d) { return d.children ? null : d.name; });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
};

