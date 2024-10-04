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
 * Displays Trace in a Table
 */
function TraceView() {
    this.tableEle = document.createElement('table');

    this.getTable = function() {
        return this.tableEle;
    }

    this.drawTrace = function(trace, name, path) {
        this.tableEle.setAttribute('id', 'trace')
        const div = document.getElementById('expandDiv');
        div.append(this.tableEle);
        let callIndex = trace[0].length - 1;
        
        // First row: path + name
        let rowEle = document.createElement('tr');
        let dataEle = document.createElement('td');
        let tableEle2 = document.createElement('table');
        tableEle2.setAttribute('class', 'table2');
        dataEle.appendChild(tableEle2);
        rowEle.appendChild(dataEle);
        this.tableEle.appendChild(rowEle);
        drawTracePath(tableEle2, callIndex, name, path);

        // Second row: variables
        drawTraceVars(tableEle2, trace);

        // Remaining rows
        rowEle = document.createElement('tr');
        dataEle = document.createElement('td');
        const div2 = document.createElement('div');
        tableEle2 = document.createElement('table');
        tableEle2.setAttribute('class', 'table2');

        div2.setAttribute('id', 'traceDiv');
        div2.appendChild(tableEle2);
        dataEle.appendChild(div2);
        rowEle.appendChild(dataEle);
        this.tableEle.appendChild(rowEle);
        drawTraceRows(tableEle2, callIndex, trace);
    }

    // First row contains the previous called and current sp-names, seperated by '>'
    function drawTracePath(tableEle, callIndex, name, path) {
        let rowEle = document.createElement('tr');
        let dataEle = document.createElement('td');
        dataEle.setAttribute('colspan', `${callIndex + 1}`);

        let ulEle = document.createElement('ul');
        let liEle;
        let liSeperator;

        // previous trace names
        path.split(',').forEach(d => {
            if(d.localeCompare("") != 0) {
                liEle = document.createElement('li');
                liEle.setAttribute('class', 'path');
                liSeperator = document.createElement('li');
                
                liEle.textContent = d;
                liSeperator.textContent = '>';
                
                ulEle.appendChild(liEle);
                ulEle.appendChild(liSeperator);
            }
        });

        // current trace
        liEle = document.createElement('li'); 
        liEle.setAttribute('class', 'currProgram');
        liEle.textContent = name;   

        ulEle.appendChild(liEle);
        dataEle.appendChild(ulEle);
        rowEle.appendChild(dataEle);
        tableEle.appendChild(rowEle);
    }

    function drawTraceVars(tableEle, trace) {
        let rowEle = document.createElement('tr');
        for(let j = -1; j < trace[1].length - 1; j++) {
            let dataEle = document.createElement('td');
            dataEle.textContent = j == -1 ? 'Step' : trace[0][j];
            dataEle.style = "";
            dataEle.style.backgroundColor = "#4ae54a";
            rowEle.appendChild(dataEle);
        }
        tableEle.appendChild(rowEle);
    }

    // Adds the remaining rows to the DOM
    function drawTraceRows(tableEle, callIndex, trace) {
        for(let i = 1; i < trace.length; i++) {
            let = rowEle = document.createElement('tr');
            let dataEle = document.createElement('td');
            tableEle.appendChild(rowEle);

            // Add First Column: Steps
            drawTraceSteps(rowEle, dataEle, i, callIndex, trace);

            // Add Remaining Columns
            drawTraceCols(rowEle, dataEle, i, trace);

            // Add calls
            if(trace[i][callIndex] != "") {
                drawTraceCalls(tableEle, rowEle, dataEle, i, callIndex, trace);
            }
        }

        //First Column of a row displays the execution step
        function drawTraceSteps(rowEle, dataEle, i, callIndex, trace) {
            //step
            if(i == 0) {
                dataEle.textContent = 'Step';
            } else {
                let stepEle = document.createElement('p');
                stepEle.setAttribute('class', 'step');
                stepEle.textContent = i;
                dataEle.appendChild(stepEle);
                if(trace[i][callIndex] != "") {
                    let openEle = document.createElement('button');
                    openEle.setAttribute('class', 'open');
                    openEle.textContent = '>';
                    dataEle.appendChild(openEle);
                }

                
            }
            rowEle.appendChild(dataEle);
        }

        // Adds remaining cols to the DOM
        function drawTraceCols(rowEle, dataEle, i, trace) {
            for(let j = 0; j < trace[0].length - 1; j++) {
                dataEle = document.createElement('td');

                let s =  trace[i][j];
                dataEle.innerHTML = s[0] == "\"" ? s.substring(1, s.length -1) : s;
                if((trace[i][j]).localeCompare("") != 0) {
                    dataEle.style.backgroundColor = "#ccffc4";
                }
                rowEle.appendChild(dataEle);
            }
        }

        // Calls column gets an extra row
        function drawTraceCalls(tableEle, rowEle, dataEle, i, callIndex, trace) {
            if(i > 0) {
                rowEle = document.createElement('tr');
                dataEle = document.createElement('td');
                dataEle.setAttribute('class', 'rowCall');
                dataEle.setAttribute('colspan', `${callIndex + 1}`);

                let calls = (trace[i][callIndex]).split(',').map(d => d.trim());
                calls.forEach(d => {
                    let callEle = document.createElement('p');
                    callEle.textContent = d;
                    callEle.setAttribute('class', 'calls');
                    dataEle.appendChild(callEle);
                });

                tableEle.appendChild(rowEle);
                rowEle.appendChild(dataEle);
                rowEle.style.display = "none";
            }
        }
    }
}