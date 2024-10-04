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
 * Extracts the trace and displays its content onto the page
 */

 function TraceVars(trace) {
    this.container = document.getElementById('container1');
    this.tableVars = document.getElementById('vars');
    this.olStk = document.getElementById('stk-scroll');
    this.iEle =  document.getElementById('step');
    this.exp = document.getElementById('exp');
    this.trace = trace;
    this.vars = [];

    function type(variable) {
        switch(variable) {
            case 's':
                return 'tree';
            case 't':
                return 'tree';
            case 'stk':
                return 'stack'
            case 'exp':
                return 'exp';
            default:
                return 'pvar';
        }
    }

    this.svgEle = [];
    this.rowEle = [];
    this.olEle = {};

    this.extractVars = function() {
        for(let i = 1; i < trace[0].length - 3; i++) {
            let variable = trace[0][i];
            
            switch(type(variable)) {
                case 'tree':
                    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('class', 'view');
                    svg.setAttribute('id', `${variable}`);
                    this.container.appendChild(svg);
                    this.vars.push(new Tree(variable, svg));
                    this.svgEle.push(svg);
                    break;
                case 'stack':
                    let ol = document.createElement('ol');
                    ol.setAttribute('id', variable);
                    this.olStk.appendChild(ol);
                    this.vars.push(new Stack(variable, ol));
                    this.olEle = ol;
                    break;
                case 'exp':
                    this.vars.push(new Variable(variable, this.exp));
                    break;
                default:
                    let tr = document.createElement('tr');
                    let tdVariable = document.createElement('td');
                    let tdValue = document.createElement('td');

                    tdVariable.textContent = variable; 
                    tdValue.textContent = '&nbsp';
                    tdValue.setAttribute('id', `${variable}`);

                    tr.appendChild(tdVariable);
                    tr.appendChild(tdValue);
                    this.tableVars.appendChild(tr);
                    this.vars.push(new Pvar(variable,tdValue));
                    this.rowEle.push(tr);
            }
        }
    }


    this.i = 1;

    this.incI = function(){
        if(this.i < this.trace.length) this.i++;
    }

    this.decI = function(){
        if(this.i > 1) this.i--;
    }

    this.setI = function(i){
        this.i = i;
    }

    this.updateVars = function(next){
        this.iEle.textContent = 'i=' + this.i;
        let row = this.trace[this.i];
        for(let j = 1; j < row.length - 3; j++) {
            let value = row[j];
            let highlight = true;

            if(next) {
                if(value == '') {
                    this.vars[j-1].element.style.backgroundColor = '';
                } else {
                    this.vars[j-1].draw(value,highlight);
                }
            } else {
                //prev
                if(value == '') {
                    highlight = false;
                    value = rowWithEntry(this.trace, this.i, j);
                    this.vars[j-1].draw(value,highlight);
                    //this.vars[j-1].element.style.backgroundColor = '';
                } else {
                    this.vars[j-1].draw(value,highlight);
                }
            } 
        }

        function rowWithEntry(trace, i, j) {
            let res = '';
            i--;
            while(i > 0) {
                let value = trace[i][j];
                if(value.localeCompare('') != 0) {
                    res = value;
                    break;
                }
                i--;
            }
            return res;
        }
    }

    this.sortVariables = function() {
        let rows = this.tableVars.rows;
        let len = rows.length;
        for(let i = 0; i < len - 1; i++) {
            for(let j = i+1; j < len; j++) {

                let curr = rows[i].getElementsByTagName("td")[1];
                let next = rows[j].getElementsByTagName("td")[1];

                let currColor = curr.style.backgroundColor;
                let nextColor = next.style.backgroundColor;

                if(currColor == '' && nextColor== 'rgb(152, 255, 160)') {
                    rows[i].parentNode.insertBefore(rows[j], rows[i]);
                }
            }
        }
    }
}