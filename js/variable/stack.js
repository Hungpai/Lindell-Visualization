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
 * Specifies a draw function for a Stack
 */

class Stack extends Variable {

    constructor(name,element) {
        super(name, element);
    }

    draw(values){
        this.element.innerHTML = '';
        values = values.split('),(')  
            .map(xs => xs.replace(/[\[{()}\]]/g, ''));
        values.forEach(value => {
            let li = document.createElement('li');
            if(value.localeCompare('') != 0) {
                li.textContent = '(' + value + ')';
            }
            this.element.appendChild(li);
        });

        // fake columns to indicate empty stack entries
        for(let i = 0; i < 8 - values.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = '&nbsp';
            this.element.appendChild(li);
        }
    }
}