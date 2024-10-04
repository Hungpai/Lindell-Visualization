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
 * Displays the predicate 
 * tree to the corresponding operation
 */

function PredicateTree() {
    this.tips = [];
    this.flowTree = {};
    this.predsTree = {};
    this.operation = '';
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    const predEle = document.getElementById('Predicate Tree');
    const contrEle = document.getElementById('Controlflow Graph'); // need size of controlflow div
    const width  = contrEle.clientWidth;
    const height = contrEle.clientHeight;
    const id = 'predTree';
    
    this.svg.setAttribute('id', id);
    predEle.appendChild(this.svg);

    this.init = function(flowTree, predsTree, operation, predSequence, nextOp) {
        predEle.appendChild(this.svg);
        this.flowTree = flowTree;
        this.predsTree = predsTree;
        this.operation = operation;

        drawTree(this.flowTree, operation);
        drawPath(this.svg, predSequence, nextOp);
    }

    this.drawTree = function(operation) {
        this.operation = operation;
        drawTree(this.flowTree, operation);
    }

    this.drawPath = function(predSequence, nextOp) {
        drawPath(this.svg, predSequence, nextOp);
    }

    this.addToolTips = function() {
        addToolTips(this.svg, this.predsTree, this.tips, this.operation);
    }

    this.addOps = function(tip) {
        this.tips = tip;
        addToolTips(this.svg, this.predsTree, this.tips, this.operation);
    }

    /**
     *  Idea: Root is set, path and child (curr)
     */
    function drawPath(svg, predSequence, nextOp) {
        let node = {};
        const red = 'rgb(219, 0, 0)';
        const green = 'rgb(0, 219, 40)';
        const blue = 'rgb(11, 0, 219)';
        
        if(predSequence.localeCompare('') == 0) {
            node = svg.getElementsByClassName(nextOp)[0].firstChild;
            node.style.fill = blue;
        } else {
            predSequence = predSequence.split('->').map(s => s.trim());
            predSequence.push(nextOp);

            // root
            let fst = predSequence[0];
            let flag = getFlag(fst); // get last 0 or 1 of predicate
            let root = getPred(fst); // cuts off the last 3 characters
            node = svg.getElementsByClassName(root)[0].firstChild;
            highlightNode(node, flag);


            // descendants
            predSequence.reduce(function(acc, curr) {
                // links
                let parent = getPred(acc);
                let child = isLast(predSequence,curr) ? curr : getPred(curr);

                let flagP = getFlag(acc);
                let flagC = isLast(predSequence,curr)? 2 : getFlag(curr);

                let links = svg.getElementsByClassName(parent + '-' + child);
                let pnodes = svg.getElementsByClassName(parent);
                let nodes = svg.getElementsByClassName(child);

                let j = 0; // find the right parent
                if(pnodes.length > 1) {
                    for(let i = 0; i < pnodes.length; i++) {
                        let style = pnodes[i].getAttribute('style');
                        if(style !== null) {
                            j = i;
                        }
                    }
                }

                let k = 0;
                if(links.length == 1) {
                    highlightLink(links[k], flagP);
                } else { // find the right link
                    let xp = +pnodes[j].firstChild.getAttribute('x');
                    for(let i = 0; i < links.length; i++) {
                        let xl = +links[i].getAttribute('x1');
                        if(xl == xp) {
                            highlightLink(links[i], flagP);
                            k = i;
                            break;
                        }
                    }
                }

                if(nodes.length == 1) {
                    highlightNode(nodes[0], flagC);
                } else { // find the right children
                    let xEnd = +links[k].getAttribute('x2');
                    let yEnd = +links[k].getAttribute('y2');
                    for(let i = 0; i < nodes.length; i++) {
                        let xPos = +nodes[i].firstChild.getAttribute('x');
                        let yPos = +nodes[i].firstChild.getAttribute('y') - 15;
                        if(xEnd == xPos && yEnd == yPos) {
                            highlightNode(nodes[i], flagC);
                            break;
                        }
                    }
                }      
                return curr;
            });
        }

        function getFlag(pred) {
            return +(pred.substring(pred.length-2, pred.length-1));
        }

        function getPred(pred) {
            return pred.slice(0,pred.length - 3);
        }

        function isLast(predSequence, child) {
            return predSequence[predSequence.length - 1].localeCompare(child) == 0;
        }

        function highlightNode(node, flag) {
            let color = 'black';
            switch(flag) {
                case 0 : color = red; break;
                case 1 : color = green; break;
                case 2 : color = blue; break;
            }
            node.style.fill = color;
        }

        function highlightLink(link, flag) {
            link.style.stroke = flag == 1 ? green : red;
        }
    }

    function drawTree(tree, operation) {
        const pred = getPredTree(tree, operation);
        pred.draw('predTree', operation, width, height, false);
    }

    function getPredTree(tree, operation) {
        const ops = tree.getNodes('Operation');
        let pred = {};
        for(let i = 0; i < ops.length; i++) {
            let name = ops[i].children[0].children[0];
            if(name.id.localeCompare(operation) == 0) {
                pred = name.parent.parent.children[1].children[0];
                break;
            }
        }
        return pred;
    }

    function addToolTips(svg, predTree, tips, operation) {
        const nodes = svg.getElementsByClassName('nodes')[0].childNodes;
        for(let i = 0; i < nodes.length; i++) {
            let node = nodes[i].className.baseVal;
            let text  = nodes[i].childNodes[0];
            let title = document.createElementNS("http://www.w3.org/2000/svg","title");
            let tip = '';

            // predicate
            if(isPredicate(node)) {
                tip = getTip(node, predTree);
                title.textContent = tip;

            // HALT
            } else if(node == 'HALT') {
                tip = 'HALT';
                title.textContent = tip;

            // OPS: already calculated in controlflow.js, find the right tip and clone
            } else {
                for(let j = 0; j < tips.length; j++) {
                    if(node == 'o_' + tips[j].id) {
                        title = tips[j].childNodes[0].cloneNode(true);
                    }
                }
            }
            text.appendChild(title);
        }

        // Operation header: upper left corner
        const node = svg.getElementById('operation');
        for(let j = 0; j < tips.length; j++) {
            if(operation == 'o_' + tips[j].id) {
                let title = document.createElementNS("http://www.w3.org/2000/svg","title");
                title = tips[j].childNodes[0].cloneNode(true);
                node.appendChild(title);
                break;
            }
        }
    }

    function isPredicate(node) {
        return node.substring(0,2) == 'p_';
    }

    function getTip(node, predTree) {
        const predicates = predTree.children;
        for(let i = 0; i < predicates.length; i++) {
            let name = predicates[i].children[0].children[0].id;
            if(node == name) {
                let expression = predicates[i].children[1].children[0].id;
                return name + ' <=> ' + expression;
            }
        }
    }
}
