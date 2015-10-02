var createPie = function(keywords) {

  // Remove previous D3 animation from #animation div
  d3.select("#animation").selectAll("svg").remove();
  d3.select("#animation").selectAll("div").remove();

  // Set pie to sort by sentiment, slice size is relevance
  var pie = d3.layout.pie()
    .sort(function(d, e) { return (d.sentiment.score || 0) - (e.sentiment.score || 0); } )
    .value(function(d) { return Math.pow(d.relevance, 2); })


  // Set width and height by actual size of animation div
  var width = document.getElementById('animation').offsetWidth,
    height = document.getElementById('animation').offsetHeight,
    radius = Math.min(width, height) / 2;

  // Create SVG element and add 'g' groupings for slices, labels, lines
  var svg = d3.select("#animation")
    .append("svg")
    .append("g")

  svg.append("g")
    .attr("class", "slices");
  svg.append("g")
    .attr("class", "labels");
  svg.append("g")
    .attr("class", "lines");

  // Set donut size and pointer arc location
  var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Center svg in div
  svg.attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

  // Set color to match sentiment, red - silver - green
  var color = d3.scale.linear()
    .domain([-1,0,1])
    .range(["#BD0000","#D3F3EE","#009F00"]);


  var svg = d3.select("svg");

  // Invoke create function, we create with empty array first as
  // we want the new data to have correct labels and colors
  create([]);
  create(keywords);

  // Create pie slices, labels, and polylines
  function create(data) {
    console.log('one pie coming up...  here is data: ');
    console.log(data);
    data = data.slice(0,12);

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data))

    slice.enter()
      .insert("path")
      .style("fill", function(d) {
        if(d.data.sentiment.score) {
          console.log('coloring slice');
          return color(d.data.sentiment.score);
        }
        else {
          return color(0);
        }
    })
      .attr("class", "slice");

    slice
      .transition().duration(1000)
      .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      })

    slice.exit()
      .remove();

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labels").selectAll("text")
      .data(pie(data))

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data.text;
      });

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate("+ pos +")";
        };
      })
      .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start":"end";
        };
      });

    text.exit()
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data))

    polyline.enter()
      .append("polyline");

    polyline.transition().duration(1000)
      .attrTween("points", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit()
      .remove();
  };
};