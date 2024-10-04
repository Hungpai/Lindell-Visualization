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
 * Specifies a draw function and parsing function for a tree
 */

class Tree extends Variable {

    constructor(name,element) {
        super(name, element);
        this.tree = new TreeNode('0', 0);
    }

    draw(value) {
        this.tree = stringToTree(value);
        this.tree.draw(this.name, this.name, this.element.clientWidth, this.element.clientHeight, true);
    }
}

// parses a tupletree-string representation to tree
function stringToTree(s) {
    s = s.split('),(')                             // split at ),(
        .map(xs => xs.replace(/[\[{()}\]]/g, ''))  // filter all parentheses
        .map(xs => xs.split(','));                 // split again, first element will be parent

    //root
    let root = new TreeNode(s[0][0],0);
    for(let i = 1; i < s[0].length; i++) {
        root.appendChildren(new TreeNode(s[0][i], 1));
    }

    //descandents
    for(let i = 1; i < s.length; i++) {
        let parent = root.getNode(s[i][0]);
        for(let j = 1; j < s[i].length; j++) {
            let child = s[i][j];
            if(child.localeCompare('') != 0) parent.appendChildren(new TreeNode(child, parent.getDepth() + 1));
        }
    }
    return root;
}