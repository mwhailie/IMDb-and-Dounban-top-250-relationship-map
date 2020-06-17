var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
var isTooltipHidden = true;
var isDouban = svg.attr("dataset") == "douban";
var filePath = isDouban ? "./files/douban_data.json" : "./files/imdb_data.json";

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter(width / 2, height / 2));


d3.json(filePath, function(error, graph) {
  if (error) throw error;

  var root = svg.append("g");

  var link = root.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = root.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .on("click", clickNode)
            .on("mouseover", focus)
            .on("mousemove", function(){return tooltip2.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", unfocus);

        
  var circles = node.append("circle")
            .attr("r", function(d) { return (d.group == "Movie") ? 10 : 5; })
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  simulation.nodes(graph.nodes)
          .on("tick", ticked);

  simulation.force("link")
          .links(graph.links);

  const zoom = d3.zoom();
    
  zoom.on("zoom", () => {
      const { transform } = d3.event;
      root.attr("transform", transform);
  });
    
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  const reset = () => {
      svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
  }

  var nodeLinkStatus = {};
  graph.links.forEach(d => {
     nodeLinkStatus[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    if (nodeLinkStatus[`${a.index},${b.index}`] || nodeLinkStatus[`${b.index},${a.index}`] || a.index === b.index) {
      console.log(a.id + b.id);
    }
    return nodeLinkStatus[`${a.index},${b.index}`] || nodeLinkStatus[`${b.index},${a.index}`] || a.index === b.index;
  }

  function focus(d) {
    node.style('stroke-opacity', o => (isConnected(d, o)? 1 : 0.3))
        .style('fill-opacity', o => (isConnected(d, o)? 1 : 0.3));

    link.style('opacity', function(l) {
       return (d === l.source || d === l.target)? 1 : 0.2;
    });

    link.style('stroke-width', function(l) {
       return (d === l.source || d === l.target) ? 5 : 1;
    });
    return tooltip2.style("visibility", "visible").text((d.group == "Movie") ? (d.id + " " + d.score) : d.id);
  }  
  function unfocus(d) {
    node.style('stroke-opacity', 1)
        .style('fill-opacity', 1);
    link.style('opacity',1);
    link.style('stroke-width', 1);
    return tooltip2.style("visibility", "hidden");
  }
  function ticked() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
      }
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

var tooltip2 = d3.select("body")
  .append("div")
  .attr("class", "badge badge-secondary")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .text("this is name");


function mouseOver(node) {
  d3.select(this).select("circle")
    .transition()
    .duration(500)
    .attr("r", 20);
  return tooltip2.style("visibility", "visible").text(node.id + " " + node.score);
}

function mouseOut(node) {
  d3.select(this).select("circle")
    .transition()
    .duration(500)
    .attr("r", (node.group == "Movie") ? 10 : 5);
  return tooltip2.style("visibility", "hidden");
}

var tooltip = d3.select("body")
          .append("div")
          .attr("class", "card mb-3")
          .style("position", "absolute");

function clickNode(node) {
    // update visibility
    if (node.group == "Movie") {
      isTooltipHidden = !isTooltipHidden;
      var visibility = (isTooltipHidden) ? "hidden" : "visible";

      // load tooltip content (if it changes based on node)
      loadTooltipContent(node);

        // place tooltip where cursor was
      return tooltip.style("top", (d3.event.pageY -10) + "px").style("left", (d3.event.pageX + 10) + "px").style("visibility", visibility);
    } else if (!isTooltipHidden) {
      isTooltipHidden = true;
      return tooltip.style("top", (d3.event.pageY -10) + "px").style("left", (d3.event.pageX + 10) + "px").style("visibility", "hidden");
    }
  }

function loadTooltipContent(node) {
  var baseUrl = isDouban ? "" : "http:\\\\www.imdb.com\\";
  var site = isDouban ? "Douban" : "IMDb";
  var htmlContent = "<div class= \"row no-gutters\">";
        htmlContent += "<div class=\"col-md-3\">" + "<img src= \"https://images.weserv.nl/?url=" + node.img + "\" class=\"card-img\" alt="+ node.id+ ">" + "<\/div>"
        htmlContent += "<div class=\"col-md-9\">"
          htmlContent += "<div class=\"card-body\">"
            htmlContent += "<h6 class=\"card-title\">" + node.id + "</h5>"
            htmlContent += "<p class=\"card-text\">"
              htmlContent += "Rank: " + node.rank
              htmlContent += " | Score: " + node.score
              htmlContent += "<br>"
              htmlContent += "Director: " + node.director
            htmlContent += "<\/p>"
            htmlContent += "<p class=\"card-text\">"
              htmlContent += "<small sclass=\"text-muted\"><a href=\"" + baseUrl + node.link + "\">Check This Movie in " + site + "<\/a>"
            htmlContent += "<\/p>"
          htmlContent += "<\/div>"
        htmlContent += "<\/div>"
      htmlContent += "<\/div>"
      tooltip.html(htmlContent);
  }