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
 * main object, divides the trace in variables, operations,
 *  predicate tree, controlflow and displaying the trace as a table
 */

function Trace(trace,name,path,lt,cfg) {
    this.trace = trace;
    this.name = name;
    this.path = path;
    // stores the data of a .lt file
    this.layoutTree = getLayoutTree(lt);
    
    // table object
    this.traceView = new TraceView();

    // variable object
    this.traceVars = new TraceVars(this.trace);

    // operation object
    this.traceOp = new TraceOp(this.traceVars.vars);

    // predicate tree object
    this.predicateTree = new PredicateTree();

    // control flow graph object
    this.controlFlow = new ControlFlow(this.name,cfg);

    //trace
    this.drawTrace = function() {
        this.traceView.drawTrace(this.trace, this.name, this.path);
    }

    this.showTable = function() {
        return this.traceView.getTable();
    }

    // vars
    this.drawVars = function() {
        this.traceVars.extractVars();
        this.traceVars.updateVars(true);
    }

    this.showVars = function(container1, tableEle, stkdiv) {
        // show trees
        this.traceVars.svgEle.forEach(svg => {
            container1.appendChild(svg);
        });

        // show remaining variables
        this.traceVars.rowEle.forEach(row => {
            tableEle.appendChild(row);
        });
        this.traceVars.sortVariables();

        // show explanation
        for(let j = 0; j < this.trace[0].length; j++) {
            if(this.trace[0][j].localeCompare("exp") == 0) {
                let value = this.trace[this.traceVars.i][j];
                this.traceVars.exp.innerHTML = value.substring(1,value.length -1);
            }
        }


        
        // some traces don't have a stack, only append stack if it exists
        if(!(Object.keys(this.traceVars.olEle).length === 0 && this.traceVars.olEle.constructor === Object)) {
            stkdiv.appendChild(this.traceVars.olEle);
        }
    }

    this.updateVars = function(btn) {
        const i = this.traceVars.i;
        switch(btn.textContent) {
            case 'prev':
                if(i > 1) {
                    this.traceVars.decI();
                    this.traceVars.updateVars(false); //prev false
                }
                break;
            case 'next':
                if(i < trace.length - 1) {
                    this.traceVars.incI();
                    this.traceVars.updateVars(true);  //next true      
                }
                break;
            default:
                this.traceVars.setI(+(btn.textContent));
                this.traceVars.updateVars(false);
        }
    }

    // counter
    this.showCounter = function(counterEle) {
        counterEle.textContent = 'i=' + this.traceVars.i;
    }

    // control flow
    this.initControlFlow = function() {
        const opsTree = this.layoutTree.getNode('Operations');
        this.controlFlow.setOp(this.trace[1][0]);
        this.controlFlow.init(this.predicateTree, opsTree);
    }

    this.showFlow = function(flowEle) {
        flowEle.appendChild(this.controlFlow.svg);
    }

    this.updateControlFlow = function() {
        const i = this.traceVars.i;
        this.controlFlow.highlight(this.trace[i][0]);
    }

    // predicate tree
    this.initPredTree = function() {
        const flowTree = this.layoutTree.getNode('Flow');
        const predTree = this.layoutTree.getNode('Predicates');
        const length = this.trace[1].length;
        const op = this.trace[1][0];
        const predSequence = this.trace[1][length - 3];
        const nextOp = this.trace[1][length - 2];
        this.predicateTree.init(flowTree, predTree, op, predSequence, nextOp);
    }

    this.upadatePredTree = function(){
        const i = this.traceVars.i;
        const op = this.trace[i][0];
        const length = this.trace[i].length;
        const predSequence = this.trace[i][length - 3];
        const nextOp = this.trace[i][length - 2];

        this.predicateTree.drawTree(op);
        this.predicateTree.drawPath(predSequence, nextOp);
        this.predicateTree.addToolTips();
    }

    this.showPredTree = function(predDiv) {
        predDiv.appendChild(this.predicateTree.svg);
    }

    // TraceOps
    this.initTraceOp = function() {
        const op = this.trace[1][0];
        this.traceOp.init();
        this.traceOp.highlight(op);
    }

    this.highlightNodes = function(btn) {
        const i = this.traceVars.i;
        const op = this.trace[i][0];

        if(btn.textContent.localeCompare('next') != 0) {
            this.traceOp.resetG();
        }
        this.traceOp.highlight(op);
    }

    /**
     * read .lt file
     * 
     * @param {string} name of .lt file
     * @return {promise} return a promise
     */
    function getLayoutTree(lt) {
            // parse text to Tree
            const data = lt.split('\n');
            const root = new TreeNode(data[0],0);
            let prev = root;

            for(let i = 1; i < data.length; i++) {
                let split = data[i].split('\t');
                let depth  = split.length - 1;
                let curr = new TreeNode(split[depth].trim(), depth);
                if(curr.depth > prev.depth) {
                    prev.appendChildren(curr);
                } else if(curr.depth == prev.depth) {
                    prev.parent.appendChildren(curr);
                } else {
                    backtrack(prev.parent,curr)
                }
                prev = curr;
            }
            return root;

        function backtrack(prev,curr) {
            if(curr.depth == prev.depth) {
                prev.parent.appendChildren(curr);
            } else {
                backtrack(prev.parent,curr);
            }
        }
    }
}

