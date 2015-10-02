
var createWordCloud = function (keywords) {

  // set width and height by actual size of animation div
  var width = document.getElementById('animation').offsetWidth;
  var height = document.getElementById('animation').offsetHeight;
  keywords = keywords.slice(0, 30);

  // set color scale from -1 to 1 (this will scale with sentiment.score)
  var color = d3.scale.linear()
    .domain([-1,0,1])
    .range(["#BD0000","#D3F3EE","#009F00"]);

  d3.select("#animation").selectAll("svg").remove();
  d3.select("#animation").selectAll("div").remove();

  // set word cloud rotaton, size, width
  d3.layout.cloud()
    .size([width, height])
    .words(keywords)
    .padding(10)
    .text(function(d) { return d.text; })
    .rotate(function() { return ~~(Math.random() * 2) * 90; }) //sets rotaton angle to 0 or 90
    .fontSize(function(d) { return d.relevance * 50 ; }) // formula used to increase font size
    .font("Impact")
    .on("end", draw)
    .start();

  function draw(words) {
     d3.select("#animation").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "wordcloud")
    .style("font-family", "Impact")
    .append("g")
    // without the transform, words words would get cutoff to the left and top, they would
    // appear outside of the SVG area
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size; })
    .style("fill", function(d) { //change color gradient to match sentiment value
      if(d.sentiment.score) {
        return color(d.sentiment.score);
      } else {
        return color(0);
      }
    })
    .attr("text-anchor", "middle") //prevents overlapping of text
    .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
  }
};