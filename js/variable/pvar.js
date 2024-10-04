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
 * Specifies a draw function for a primitive Variable
 */
class  Pvar extends Variable {

    constructor(name,element) {
        super(name, element);
    }

    draw(value,highlight){

        if(highlight) {
            this.element.textContent = value;
            const table = this.element.parentNode.parentNode;
            const row = this.element.parentNode;
            if(value == "undefined") {
                this.element.style.backgroundColor = '"';
                table.appendChild(row);
            } else {
                this.element.style.backgroundColor = 'rgb(152, 255, 160)';
                table.insertBefore(row, table.rows[0]);
            }
        } else {
            this.element.style.backgroundColor = '';
        }
    }
}