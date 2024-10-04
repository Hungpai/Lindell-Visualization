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
 * Highlight Trees (S,T) based on the current operation
 */
function TraceOp(vars) {
    this.vars= vars;
    this.layoutTree = {};
    this.trees = [];
    this.nodes = [];

    this.groups = [];

    this.init = function() {
        for(let i = 0; i < this.vars.length; i++) {
            if(this.vars[i].name.match(/^(u|v|u1|v1)$/)) {
                this.nodes.push(vars[i]);
            } else if(this.vars[i].name.match(/^(s|t)$/)) {
                this.trees.push(vars[i]);
            }
        }
    }   

    this.setLayoutTree = function(layoutTree) {
        this.layoutTree = layoutTree;
    }

    this.resetG = function() {
        this.groups.forEach(g => {
            if(document.body.contains(g)) {
                g.firstChild.style.fill = 'rgb(255, 255, 255)';
                const c = g.children;
                for(let i = 2; i< c.length; i++) {
                    g.removeChild(g.lastChild);
                }
            }
        });
        this.groups = [];
    }

    this.highlight = function(op) {
        const red = 'rgb(255, 158, 158)';
        const green = 'rgb(158, 255, 190)';
        this.groups.forEach(group => {
            group.firstChild.style.fill = 'rgb(255, 255, 255)';
            const c = group.children;
            for(let i = 2; i< c.length; i++) {
                group.removeChild(group.lastChild);
            }
        });
        this.groups = [];
        this.nodes.forEach(node => {
            if(node.element.textContent.localeCompare('undefined') != 0) {
                const treeEle =  getRelatedTree(this.trees, node);
                const id = node.element.textContent;

                const g = d3.select('#' + treeEle.name + ' [id="' + `${id}` + '"]');
                const group = g.node();
                this.groups.push(group);
                const circle = group.firstChild;
                
                const x = +circle.getAttribute('cx');
                const y = +circle.getAttribute('cy');

                if(circle.style.fill.localeCompare('rgb(255, 255, 255)') == 0 || circle.style.fill.localeCompare('') == 0){
                    circle.style.fill = 'rgb(88, 249, 255)';
                } 

                g.append('text')
                    .attr('x', `${node.name.match(/^(u|v)$/) ? x+30 : x-30}`)
                    .attr('y', `${y+2}`)
                    .attr('dy', '0.2em')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 1 + 'em')
                    .text(node.name); 

                const tree = treeEle.tree;
                const n = tree.getNode(id);
                const nodes = n.allNodes();

                if(node.name.match(/^(u|v)$/)) {
                    switch(op) {
                        case 'o_iso':
                            highlightAll(treeEle, nodes, green, this.groups);
                            break;
                        case 'o_gt':
                            highlightAll(treeEle, nodes, red, this.groups);
                            break;
                        case 'o_lt':
                            highlightAll(treeEle, nodes, red, this.groups);
                            break;
                    }
                }
            } 
        })
    }

    function highlightAll(tree, nodes, color, groups) {
        nodes.forEach(node => {
            // let circle = tree.element.getElementById(node).firstChild;
            // circle.style.fill = color;
            // t.push(circle);

            const g = d3.select('#' + tree.name + ' [id="' + `${node}` + '"]');
            const group = g.node();
            const circle = group.firstChild;
            circle.style.fill = color;
            groups.push(group);
        })
    }

    function getRelatedTree(trees, node) {
        if(trees.length == 1) return trees[0];
        if(node.name.match(/^(u|u1)$/)) {
            return trees[0];
        } else {
            return trees[1];
        }

    }
}