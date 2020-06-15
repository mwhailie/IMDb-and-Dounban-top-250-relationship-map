var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
var isTooltipHidden = true;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter(width / 2, height / 2));


d3.json("./files/imdb_data.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .on("click", clickNode);

        
  var circles = node.append("circle")
            .attr("r", function(d) { return (d.group == "Movie") ? 8 : 5; })
            .attr("fill", function(d) { return color(d.group); })
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

      // var lables = node.append("text")
      //     .text(function(d) {
      //       return d.id;
      //     })
      //     .attr('x', 6)
      //     .attr('y', 3);

  node.append("title")
    .text(function(d) { return d.id; });

  simulation.nodes(graph.nodes)
          .on("tick", ticked);

  simulation.force("link")
          .links(graph.links);

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


  var tooltip = d3.select("body")
          .append("div")
          // .attr("class", "tooltip")
          .attr("class", "card mb-3")
          .style("position", "absolute")
          // .style("padding", "10px")
          // .style("z-index", "10")
          .style("max-width", "800px");
          // .style("height", "150px");
          // .style("background-color", "rgba(230, 242, 255, 0.8)")
          // .style("border-radius", "5px");

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
    var htmlContent = "<div class= \"row no-gutters\">";
        htmlContent += "<div class=\"col-md-3\">" + "<img src= \"" + node.img + "\" class=\"card-img\" alt="+ node.id+ ">" + "<\/div>"
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
              htmlContent += "<small sclass=\"text-muted\"><a href=\"http:\\\\www.imdb.com\\" + node.link + "\">Check This Movie in IMDb<\/a>"
            htmlContent += "<\/p>"
          htmlContent += "<\/div>"
        htmlContent += "<\/div>"
      htmlContent += "<\/div>"
      tooltip.html(htmlContent);
  }