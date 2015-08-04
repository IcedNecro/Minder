
var GraphVisualization = function() {
    this.width = $(window).width();
    this.height = $(window).height();
}

var subscribersGraphCallback = function (node) {
    open_right_panel()
    angular.element(document.getElementById('controller-body')).scope().getUserStats(node.id);
};

var subscribersGraphNode = function(g,json) {
    var node = g.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(this.force.drag);

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

    return node;
}

var mindsGraphNode = function(g,json) {
    var node = g.selectAll('.node')
        .data(json.nodes)
        .enter().append("g")
        .attr("class", function(d) {return "node "+d.type;})
        .call(this.force.drag);

    node.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r','32px')
        .attr('fill', 'red')

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.title });

    return node;
}

var mindsClickCallback = function(node) {

}

GraphVisualization.prototype.onClickCallback = subscribersGraphCallback
GraphVisualization.prototype.drawNode = subscribersGraphNode

GraphVisualization.prototype.setOnClickFunction = function(callback) {
    this.onClickCallback = callback;
}

GraphVisualization.prototype.drawGraph = function(data){

    this.svg = d3.select("svg");
    this.svg.selectAll("*").remove();
    this.force = d3.layout.force()
        .gravity(.05)
        .distance(200)
        .charge(-200)
        .size([this.height,this.width]);
    json = data
    this.g = this.svg.append('g')
                .attr('transform', 'translate(0 -'+this.height/4+')')
    this.force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = this.g.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

    var node = this.drawNode(this.g, json)
    node.on("click",this.onClickCallback)

    this.force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    })
}

