
var drawGraph = function(data){
    var width = 1600,
        height = 900;

    var svg = d3.select("svg");
    svg.selectAll("*").remove();
    var force = d3.layout.force()
        .gravity(.05)
        .distance(200)
        .charge(-200)
        .size([width, height]);
    json = data

    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("image")
        .attr("xlink:href", function(d) { return d.image_url; })
        .attr("x", -32)
        .attr("y", -32)
        .attr("width", 64)
        .attr("height", 64);

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.username });

    node.on("click",function(node) {
        open_right_panel()
        angular.element(document.getElementById('controller-body')).scope().getUserStats(node.id);

    });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    })
}