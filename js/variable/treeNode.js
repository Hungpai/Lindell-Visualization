/** 
MIT License

Copyright (c) 2020 Tien Hung Ngo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Datastructure for Tree
 */

class TreeNode{
    constructor(id, depth) {
        this.id = id;
        this.depth = depth;
        this.parent = null;
        this.children = [];
    }

    getId() {
        return this.id;
    }

    getChildren() {
        return this.children;
    }

    getDepth() {
        return this.depth;
    }

    getParent() {
        return this.parent;
    }

    getNode(id) {
        let res = new TreeNode('0');
        if(id.localeCompare(this.id) == 0){
            res = this;
        } else {
            for(let i = 0; i < this.children.length; i++) {
                res = this.children[i].getNode(id);
                if(res.id.localeCompare(id) == 0) break;
            }
        }
        return res;
    }

    getNodes(id) {
        let res = [];
        if(id.localeCompare(this.id) == 0){
            res.push(this);
        } else {
            for(let i = 0; i < this.children.length; i++) {
                res.push(this.children[i].getNode(id));
            }
        }
        return res;
    }

    setParent(p) {
        this.parent = p;
    }

    appendChildren(c) {
        this.children.push(c);
        c.setParent(this);
        return this;
    }


    allNodes() {
        let res = [];
        res.push(this.id);
        this.children.forEach(c => {
            res = res.concat(c.allNodes());
        })
        return res;
    }

    // based on https://www.d3indepth.com/layouts/
    draw(id, name, width, height, circle) {
        const op = name.slice(2).toUpperCase();
        const svg = d3.select('#' + id);
        svg.selectAll('*').remove();
        
        // margin convention
        const margin = { top: 100, right: 40, bottom: 0, left: 0};
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const treeLayout = d3.tree()
            .size([innerWidth, innerHeight]);
        
        const zoomG = svg
                .attr('width', width)
                .attr('height', height)
            .append('g');
        
        const g = zoomG.append('g')
            .attr('transform',`translate(${margin.left},${margin.right})`);
        
        svg.call(d3.zoom().on('zoom', () => {
            zoomG.attr('transform', d3.event.transform);
        }));
        

            const root = d3.hierarchy(this);

            // d3.js data join
            // create edges
            const links = g.append('g')  
                    .attr('class', 'links')
                .selectAll('link')
                    .data(treeLayout(root).links())
                    .enter()
                    .append('line')
                    .classed('link', true)
                    .attr('x1', function(d) {return d.source.x;})
                    .attr('y1', function(d) {return circle? d.source.y : d.source.y + 15;})
                    .attr('x2', function(d) {return d.target.x;})
                    .attr('y2', function(d) {return circle? d.target.y : d.target.y - 15;})
                    .attr(circle ? 'id' : 'class', function(d) {return d.source.data.id + '-' + d.target.data.id});

            // create nodes:
            const node = g.append("g")
                .attr('class', 'nodes')
                .selectAll("g")
                .data(root.descendants())
                .join("g")
                .attr(circle ? 'id' : 'class', d => d.data.id);

            // append circle
            if(circle) {
                node.append('circle')
                    .classed('node', true)
                    .attr('cx', function(d) {return d.x;})
                    .attr('cy', function(d) {return d.y;})
                    .attr('r', 15);
            }
            // append text
            node.append('text')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('dy', '0.2em')
                .attr('text-anchor', 'middle')
                .attr('font-size', 1 + 'em')
                .text(d => d.data.id); 
                
            if(!circle) {
                g.append('rect')
                    .attr('x', 25)
                    .attr('y', -30)
                    .attr('width', displayTextWidth(op, '20px serif') + 10)
                    .attr('height', 30)
                    .attr('fill', 'rgb(253, 253, 70)')
                    .style('stroke', 'black')
                    .style("stroke-width", '2px')
            }
      
            g.append('text')
                .attr('x', 30)
                .attr('y', -13)
                .attr('dy', '0.2em')
                .text(`${circle ? id : op}`)
                .attr('id', 'operation');
    }
}
// retrieved from https://www.tutorialspoint.com/Calculate-text-width-with-JavaScript
function displayTextWidth(text, font) {
    var myCanvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    var context = myCanvas.getContext("2d");
    context.font = font;
   
    var metrics = context.measureText(text);
    return metrics.width;
}