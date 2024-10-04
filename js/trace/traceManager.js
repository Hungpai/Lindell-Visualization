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
function TraceManager(trace,name,csv,lt,cfg) {

    // references to dom elements, container for the visualization parts
    const bManager = new ButtonManager(this,csv);
    const container = document.getElementById('expandDiv');
    const container1 = document.getElementById('container1');
    const stkdiv = document.getElementById('stk-scroll');
    const tableEle = document.getElementById('vars');
    const predDiv = document.getElementById('Predicate Tree');
    const flowDiv = document.getElementById('Controlflow Graph');
    const counter =  document.getElementById('step');

    // push/pop traces onto stack
    let stk = [];
    let last = 0;

    /**
     * Pushes trace onto stack and inits/draws the components.
     * Will be called whenever a new Trace is added
     */
    this.initTrace = function() {
        const contrf = cfg.svgFiles[name + '.svg'];
        const layoutTree = lt.ltFiles[name + '.lt'];
        stk.push(new Trace(trace, name, '', layoutTree, contrf));

        stk[0].drawTrace();
        stk[0].drawVars();
        stk[0].initControlFlow();
        stk[0].initPredTree();
        stk[0].initTraceOp();

        container.style.display = 'none';
        bManager.updateButtons();
    }

    /**
     * Adds a new Trace and pushes it onto the stack
     * 
     * @param {string[][]} trace 
     * @param {string} name of trace
     */
    this.addTrace = function(trace, name) {
        let path = "";
        stk.forEach(t => {
            path += t.name + ",";
        });
        last++;
        const contrf = cfg.svgFiles[name + '.svg'];
        const layoutTree = lt.ltFiles[name + '.lt'];
        stk.push(new Trace(trace, name, path, layoutTree, contrf));
    }

    /**
     * After a new traces is added, draw/display it
     */
    this.displayTrace = function() {
        stk[last].drawTrace();
        stk[last].drawVars();
        stk[last].initControlFlow();
        stk[last].initPredTree();
        stk[last].initTraceOp();
        bManager.updateButtons();
    }

    /**
     * After pushing a trace, remove the current trace
     */
    this.removeTrace = function() {
        // remove trace
        let child = container.firstElementChild;
        container.removeChild(child);

        // remove vars
        container1.innerHTML = '';
        tableEle.innerHTML = '';

        // remove stack elements
        // let childs = stkdiv.childNodes;
        // console.log("Hallo", childs);
        // if(childs.length > 0) {
        //     stkdiv.removeChild(childs[0]);
        // }
        stkdiv.innerHTML = '';

        // remove control flow graph
        flowDiv.innerHTML = '';

        // remove predicate tree
        predDiv.innerHTML = '';
    }
    
    /**
     * Pops traces until index is the last element
     * 
     * @param {int} index 
     */
    this.popTrace = function(index) {
        while(index + 1 != stk.length) {
            last--;
            stk.pop();
        }
    }

    /**
     * After is trace is popped, show the last trace.
     * No need to draw/init the trace again, because every trace knows how it "looks like"
     * 
     */
    this.showTrace = function() {
        // table
        container.appendChild(stk[last].showTable());

        // vars
        stk[last].showVars(container1, tableEle, stkdiv);

        // counter
        stk[last].showCounter(counter);

        // flow
        stk[last].showFlow(flowDiv);

        // pred
        stk[last].showPredTree(predDiv);
    }

    /**
     * Based on the button pressed (prev or next), update 
     * it's components
     * @param {string} btn 
     */
    this.newState = function(btn) {
        stk[last].updateVars(btn);
        stk[last].updateControlFlow();
        stk[last].upadatePredTree();
        stk[last].highlightNodes(btn);
    }
}