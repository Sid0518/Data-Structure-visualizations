let width = 1440;
let height = Math.floor((9 / 16) * width);

let borderX = 50
let borderY = 50;

let tree = null;
let AVL = 0;
let RB = 1;

let treeValues = [];
let valueCount = 36;

let level = 5;

let gap = 2;
let n = Math.pow(2, level - 1);
let nodeDiameter = ((width - 2*borderX) - (n - 1) * gap) / n;
let levelGap = (height - 2*borderY) / (level + 2);

let rbegin = borderX;
let rwidth = (width - 2*borderX);
let rx = (width / 2);
let ry = borderY + levelGap;

let FPS = 60;
let pauseTime = 0.4; // between 0 and 1 second
let animSteps = FPS * (1 - pauseTime);

function setup() {
    createCanvas(width, height);
    background(255, 255, 255);

    fill(255);
    stroke(0, 0, 0);

    let treeType = AVL;  // set this to AVL or RB
    if (treeType == AVL)
        tree = new AVLTree(nodeDiameter);
    else if (treeType == RB)
        tree =  new RedBlackTree(nodeDiameter);
    else
        tree = new GenericTree(nodeDiameter);

    for (var i = 0; i < valueCount; i++)
      treeValues[i] = floor(random(0, 200));

    textAlign(CENTER, CENTER);

    frameRate(FPS);
}

let index = 0;
let nodes = [];
let frame = 0;

function draw() {
    background(255);

    if (frame % FPS == 0) {
        let rotation_made = false;
        let node = null;

        while (nodes.length > 0) {
            node = nodes.shift();
            [node, rotation_made] = tree.applyFix(node);

            if(rotation_made) {
                if (nodes.length > 0) {
                    let parent = nodes[0];
                    if (node.value < parent.value)
                        parent.left = node;
                    else
                        parent.right = node;
                }

                else
                    tree.root = node;

                tree.root.updatePositions(rbegin, rwidth, rx, ry);
                nodes.unshift(node);
                break;
            }
        }

        if(!rotation_made) {
            if (tree.root != null && tree.root.height > level) {
                level = tree.root.height;

                nodeDiameter = (nodeDiameter - gap) / 2;
                levelGap = height / (level + 2);
                ry = levelGap;

                tree.updateSize(nodeDiameter);
            }

            if(index < treeValues.length)
                nodes = tree.addNode(treeValues[index++]);
        }
    }

    tree.update();
    tree.display();

    ++frame;
}
