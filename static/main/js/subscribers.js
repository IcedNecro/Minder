
var GraphVisualization = function() {
    this.width = $(window).width();
    this.height = $(window).height();
    this.currentY = this.height/4;
    this.currentX = 0;
    d3.select('body')
        .append('div')
            .attr('class','drag_overlay')
            .style('display','none')

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
        .attr("dx", 32)
        .attr("dy", ".35em")
        .text(function(d) { return d.username });

    return node;
}

var mindsGraphNode = function(g,json) {

    json.nodes.forEach(function(k,v){
        if(k.type == 'category')
            k.radius = 65;
        else
            k.radius = 35+10*Math.log(k.value+1)
    })

    var node = g.selectAll('.node')
        .data(json.nodes)
        .enter().append("g")
        .attr("class", function(d) {return "node "+d.type;})
        .call(this.force.drag);

    node.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', function(d){
            if(d.authored)
                return '#0d6bad';
            else
                return '#0698e1';
        } )

    node.selectAll('.node circle')
        .attr('r',function(d) {
            return d.radius;
        })

    node.append("text")
        .attr("dx", function(d) { return d.title.length>15 ? -d.radius*0.3*3 : -d.radius*0.1*d.title.length/2;})
        .attr("dy", ".35em")
        .style('font-size',function(d) {return d.radius*0.3+'px'})
        .style('fill','white')
        .text(function(d) { return d.title.length>15 ? (d.title.slice(0,15)+'...') : d.title });

    return node;
}

var mindsClickCallback = function(node) {
    angular.element(document.getElementById('controller-body')).scope().requestFullMind(node.id);

}

GraphVisualization.prototype.onClickCallback = subscribersGraphCallback
GraphVisualization.prototype.drawNode = subscribersGraphNode

GraphVisualization.prototype.setOnClickFunction = function(callback) {
    this.onClickCallback = callback;
}

GraphVisualization.prototype.drawGraph = function(data){
    var self = this;
    this.nodeFocused = false;
    this.svg = d3.select("svg");
    this.svg.selectAll("*").remove();
    this.force = d3.layout.force()
        .gravity(.05)
        .distance(200)
        .charge(-500)
        .theta(1.6)
        .size([this.height,this.width]);

    json = data;
    this.g = this.svg.append('g')
                .attr('transform', 'translate('+this.currentX+ ','+(-this.currentY)+')');
    this.force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = this.g.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link");

    var node = this.drawNode(this.g, json);
    node.on("click",this.onClickCallback);


    var drag = d3.behavior.drag()
        .on("drag", function() {
            if(d3.event.sourceEvent.ctrlKey == true) {
                var dx = d3.event.sourceEvent.movementX;
                var dy = d3.event.sourceEvent.movementY;

                self.g.attr('transform','translate('+(self.currentX+=dx)+ ',-'+(self.currentY-=dy)+')')
            }
        }).on('dragstart', function (d) {
            if(d3.event.sourceEvent.ctrlKey == true) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
            }
        }).on('dragend', function dragended(d) {
            if(d3.event.sourceEvent.ctrlKey == true) {
                d3.select(this).classed("dragging", false);
            }
        });
        var drag = d3.behavior.drag()
            .on("drag", function() {
                if(d3.event.sourceEvent.ctrlKey == true) {
                    var dx = d3.event.sourceEvent.movementX;
                    var dy = d3.event.sourceEvent.movementY;

                    self.g.attr('transform','translate('+(self.currentX+=dx)+ ',-'+(self.currentY-=dy)+')');
                }
            }).on('dragstart', function (d) {
                if(d3.event.sourceEvent.ctrlKey == true) {
                    //d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                }
            }).on('dragend', function dragended(d) {
                d3.select(this).classed("dragging", false);
                d3.select('.drag_overlay').style('display', 'none');
            });

    self.nonDialog = true
    d3.select('body')
        .on('keydown', function() {
            if(self.nonDialog && d3.event.ctrlKey)
                d3.selectAll('.drag_overlay').attr('style', null)
        })
        .on('keyup', function() {
            if(self.nonDialog )
                d3.select('.drag_overlay').style('display', 'none')
        })
    d3.selectAll('.drag_overlay').call(drag)
    //this.g.call(drag)
    this.force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    })
}

