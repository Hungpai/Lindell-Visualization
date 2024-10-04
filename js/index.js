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
 * Starting point of the visualization
*/


// first trace 
const csv = new CsvData();
const lt = new LayoutTree();
const cfg = new Cfg();

// inital csv
const text = csv.traces["1.csv"];

// rows
const data = text.split('\n');

// cut the first and the last 2 rows
const rows = data.slice(1, data.length - 3);

// columns
let trace = rows.map(d => d.split(';'));
let name = trace[0][0].trim();

// cut first row (name is already stored) and 'Source Line No' column
trace = trace.slice(1).map(d => d.slice(0, d.length -1));

// adds and inits trace to TraceManager
new TraceManager(trace,name,csv, lt, cfg).initTrace();

