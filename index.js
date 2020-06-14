// https://observablehq.com/@mwhailie/disjoint-force-directed-graph/2@230
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["data@1.json",new URL("./files/data.json",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# IMDB 250 Relationship Graph

Base on crawed data from [IMDB 250](https://www.imdb.com/chart/top/), this graph shows relationship bewteen 250 top movies, actors and directors.`
)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","color","drag","invalidation"], function(data,d3,width,color,drag,invalidation)
{
  const height = 680
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));
  var isTooltipHidden = true;

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", d => (d.group == "Movie") ? 8 : 5)
      .attr("fill", color)
      .call(drag(simulation))
      .on("click", clickNode);

  node.append("title")
      .text(d => d.id);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("href", d => "https://www.imdb.com/" + d.title);
  });

  invalidation.then(() => simulation.stop());

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("z-index", "10")
    .style("width", "400px")
    .style("height", "150px")
    .style("background-color", "rgba(230, 242, 255, 0.8)")
    .style("border-radius", "5px")
    .style("visibility", "hidden");

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
  // reset nodes to not be pinned
  function unPinNode(node) {
     node.fx = null;
     node.fy = null;
  }
  
  // add html content to tooltip
  function loadTooltipContent(node) {
      var htmlContent = "<div style=\"float: right\">";
      htmlContent += "<div style=\"float:left\">" + "<img src= \"" + node.img + "\" width=\"100\" height=\"150\" alt="+ node.id+ ">" + "<\/div>"
      htmlContent += "<div style=\"float:left\"><a href=\"http:\\\\www.imdb.com\\" + node.link + "\">" + node.id + "<\/a>"
      htmlContent += "<br>"
      htmlContent += "Rank: " + node.rank
      htmlContent += "<br>"
      htmlContent += "Score: " + node.score
      htmlContent += "<br>"
      htmlContent += "Director: " + node.director
      htmlContent += "<br>"
      htmlContent += "Stars: " + node.actor1 + ", " + node.actor2
      htmlContent += "<\/div><\/div>"
      tooltip.html(htmlContent);
  }

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("data@1.json").json()
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
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
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
