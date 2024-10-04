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
 * Draws the controlflow graph to the corresponding trace
 */
function ControlFlow(name,cfg) {
    this.name = name;
    this.opsTree =  {};
    this.op = '';
    
    this.svg = document.createElement('svg');
    this.svg.innerHTML = cfg;
    
    let rects = []; // stores all rect elements
    const element = document.getElementById('Controlflow Graph');
    
    this.init = function(predTree, opsTree) {
        const localOp = this.op;
        this.opsTree = opsTree;
        element.appendChild(this.svg); 
        draw(this.svg, element, rects);
            try{
                addToolTips(rects, opsTree, predTree);
            } catch (e) {}
        highlightOp(cut(localOp));
    }

    this.setOp = function(op) {
        this.op = op;
    }

    this.highlight = function(op) {
        highlightOp(cut(op));
    }

    // clean up string, operations occur with a leading white space
    function cut(op) {
        return op.slice(2);
    }

    function highlightOp(op) {
        rects.forEach(rect => { 
            if(rect.id.localeCompare(op.toLowerCase()) == 0) {
                rect.style.fill = 'rgb(253, 253, 70)';
            } else {
                rect.style.fill = 'rgb(255, 255, 255)';
            }
        })
    }

    function draw(svg, element, rects) {
        const svgEle = svg.getElementsByTagName('svg')[0];

        const dive = svgEle.getElementsByTagName('div');
        for(var i = 0; i < dive.length; i++) {
            dive[i].style.pointerEvents = 'none';
        }   

        const width = element.clientWidth;
        const height = element.clientHeight;
        svgEle.setAttribute('width', `${width}`);
        svgEle.setAttribute('height', `${height}`);
        svgEle.style.backgroundColor = "rgb(0, 0, 0, 0)";
        
        // give every rect element of the svg an id
        var rectsInner = svgEle.getElementsByTagName('rect');
        [].slice.call(rectsInner).forEach(rect => {
            const div = rect.nextSibling.firstChild.firstChild.firstChild.firstChild;
            let id = '';
            if(div.textContent.toLowerCase().localeCompare('') == 0) {
                let img = div.getElementsByTagName('img');
                let cutoff = '{displaystyle ';
                let attr = img[0].alt.substring(cutoff.length, img[0].alt.length-2);
                /**
                 * cong == iso
                 * prec == lt
                 * succ == gt
                 */
                switch(attr) {
                    case 'cong':
                        id = 'iso';
                        break;
                    case 'prec':
                        id = 'lt';
                        break;
                    case 'succ':
                        id = 'gt'
                        break;
                }
            } else {
                id = div.textContent.toLowerCase();
            }
            rect.setAttribute('id', `${id}`);
            rects.push(rect);
        });
    }

    // add tooltips to every rect, extract data from LabeledTree[Operations] to create tooltips
    function addToolTips(rects, opsTree, pred) {
        for(var i = 0; i < rects.length; i++) {
            let id = rects[i].getAttribute('id');
            let tip = getTip(id, opsTree);
            let title = document.createElementNS("http://www.w3.org/2000/svg","title");
            title.textContent = tip;
            rects[i].appendChild(title);
        }

        // add tooltips predicate tree
        pred.addOps(rects);
    }

    // iterate through labaled tree and create tooltip string
    function getTip(id, opsTree) {
        const operations = opsTree.children;
        let tip = '';
        for(var i = 0; i < operations.length; i++) {
            let name = cut(operations[i].children[0].children[0].id).toLowerCase();
            if(name == id) {
                tip += name.toUpperCase() + '\n';
                let assignments = operations[i].children[1].children;
                for(var j = 0; j < assignments.length; j++) {
                    let assignment = assignments[j].children;
                    let variable = assignment[0].children[0].id;

                    if(variable != 'exp\'') {
                        let expression = assignment[1].children[0].id;
                        tip += variable + ' = ' + expression + '\n';
                    }
                }
                break;
            }
        }
        return tip;
    }
}