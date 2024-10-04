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
 * This class manages all buttons and its logics
*/

function ButtonManager(traceManager,csv) {

    // Button to display controlflow
    const flowBtn = document.getElementById('flowBtn');
    flowBtn.click();
    
    // Buttons to display the complete trace
    const expandBtn = document.getElementById('expand');
    expandBtn.addEventListener('click', ()=> {
        const el = document.getElementById('expandDiv');
        if(el.style.display == 'none') {
            el.style.display = 'table';
            expandBtn.textContent = 'Close Trace';
        } else {
            el.style.display = 'none';
            expandBtn.textContent = 'Open Trace';
        }
    });

    // Button to move one step backward
    const prevBtn = document.getElementById('prev');
    prevBtn.addEventListener('click', () => {
        traceManager.newState(prevBtn);
    });

    // Button to move one step forward
    const nextBtn = document.getElementById('next');
    nextBtn.addEventListener('click', () => {
        traceManager.newState(nextBtn);
    });

    // left and right arrow key to go to next or previous state
    document.addEventListener('keydown', (e) => {
        if(e.code === 'ArrowRight') nextBtn.click();
        else if(e.code === 'ArrowLeft') prevBtn.click();
    })

    // the buttons below relate to the buttons when opening the complete trace
    this.updateButtons = function() {

        // buttons to open further references to sub-traces
        const openBtn = document.getElementsByClassName('open');
        for(let i = 0; i < openBtn.length; i++) {
            openBtn[i].addEventListener('click', function() {
                const callRow = this.parentElement.parentElement.nextElementSibling;
                if(callRow.style.display == 'none') {
                    this.textContent = 'v';
                    callRow.style.display = "table-row"
                } else {
                    callRow.style.display = "none"
                    this.textContent = '>';
                }
            }, false);
        }

        // each row has step-buttons to jump to a programstate
        const stepBtn = document.getElementsByClassName('step');
        for(let i = 0; i < stepBtn.length; i++) {
            stepBtn[i].addEventListener('click', function() {
                expandBtn.click();
                traceManager.newState(stepBtn[i]);
            }, false);
        }

        // a new trace opens when the user clicks a callbtn
        const callBtn = document.getElementsByClassName('calls');
        for(let i = 0; i < callBtn.length; i++) {
            callBtn[i].addEventListener('click', function() {
                const text = csv.traces[this.textContent + '.csv'];
                const data = text.split('\n');
                const rows = data.slice(1, data.length - 3);

                let table = rows.map(d => d.split(';'));
                let name = table[0][0].trim();

                table = table.slice(1).map(d => d.slice(0, d.length -1));

                flowBtn.click();
                traceManager.removeTrace();
                traceManager.addTrace(table, name);
                traceManager.displayTrace();
    }, false);
        }

        // this buttons relates to the header of a trace, enables the view of previous traces
        const pathBtn = document.getElementsByClassName('path');
        const pathBtnArray = Array.prototype.slice.call(pathBtn); // easy access to index of clicked li element
        for(let i = 0; i < pathBtn.length; i++) {
            pathBtn[i].addEventListener('click', function() {
                let index = pathBtnArray.indexOf(this);
                
                traceManager.removeTrace();
                traceManager.popTrace(index);
                traceManager.showTrace();

            }, false);
        }
    }
}
