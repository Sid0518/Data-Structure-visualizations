let treeType = 'RB';  // set this to AVL or RB

let width, height;
let borderX, borderY;

let tree = null;

let level = 5;
let gap = 10;
let size, levelGap;

let rx, ry, rwidth;

let FPS = 60;

let insertButton, removeButton;
let buttonEnabled = true;

let textBox;

function clearTree()
{   tree.root.relocateSubtree(width/2, height + tree.s, width);   }

function selectTree() {
    if (treeType == 'AVL')
        tree = new AVLTree(size);
    else if (treeType == 'RB')
        tree =  new RedBlackTree(size);
}

function toggleTree() {
    if (buttonEnabled) {
        buttonEnabled = false;

        if (treeType == 'AVL')
            treeType = 'RB';
        else if (treeType == 'RB')
            treeType = 'AVL';

        if (tree != null && tree.root != null) {
            clearTree();
            window.setTimeout(selectTree, 1000);
            window.setTimeout(activateButtons, 1000);
        }

        else {
            selectTree();
            activateButtons();
        }
    }
}

function activateButtons() {
    buttonEnabled = true;
    textBox.elt.focus();
}

function performRotations() {
    tree.performRotation();
    tree.relocate();
    tree.removeRedundantRotations();

    if (tree.hasPendingRotations())
        window.setTimeout(performRotations, 1000);
    else
        window.setTimeout(activateButtons, 1000);
}

function insertNode() {
    if (buttonEnabled) {
        buttonEnabled = false;

        let value = parseInt(textBox.value());
        textBox.value('');

        if (!isNaN(value)) {
            tree.addNode(value);
            tree.relocate();
        }

        else
            alert('Please enter an integer.');

        tree.removeRedundantRotations();
        if (tree.hasPendingRotations())
            window.setTimeout(performRotations, 1000);
        else
            window.setTimeout(activateButtons, 1000);
    }
}

function removeNode() {
    if (buttonEnabled) {
        buttonEnabled = false;

        let value = parseInt(textBox.value());
        textBox.value('');

        if (!isNaN(value)) {
            tree.removeNode(value);
            tree.relocate();
        }

        else
            alert('Please enter an integer');

        tree.removeRedundantRotations();
        if (tree.hasPendingRotations())
            window.setTimeout(performRotations, 1000);
        else
            window.setTimeout(activateButtons, 1000);
    }
}

function setup() {
    width = windowWidth;
    height = windowHeight;
    createCanvas(width, height);

    borderX = 0.025 * width;
    borderY = 0.025 * height;

    textAlign(CENTER, CENTER);

    let n = Math.pow(2, level - 1);
    size = ((width - 2*borderX) - (n - 1) * gap) / n;
    levelGap = (height - 2*borderY) / (level + 2);

    rx = (width / 2);
    ry = (borderY + levelGap + size/2);
    rwidth = (width - 2*borderX);

    selectTree();

    toggleButton = createButton('Change Tree');
    insertButton = createButton('Insert');
    removeButton = createButton('Remove');
    textBox = createInput();

    let elements = [toggleButton, textBox, insertButton, removeButton];

    let W = 0.4 * width;
    let w = 2*W / (3*elements.length + 1);
    let h = levelGap - borderY;

    let x = (width - W + w)/2;
    let y = borderY;

    for (let element of elements) {
        element.size(w, h);
        element.position(x, y);
        element.style('font-size', h/5 + 'px');
        element.style('text-align', 'center');

        x += 1.5*w;
    }

    toggleButton.mousePressed(toggleTree);
    insertButton.mousePressed(insertNode);
    removeButton.mousePressed(removeNode);
    textBox.elt.focus();

    frameRate(FPS);
}

function draw() {
    background(255);

    let newLevel = max(5, tree.height);
    if (level != newLevel) {
        level = newLevel;
        let n = Math.pow(2, level - 1);

        size = ((width - 2*borderX) - (n - 1) * gap) / n;
        levelGap = (height - 2*borderY) / (level + 2);
        ry = (borderY + levelGap + size/2);

        tree.resize(size);
    }

    tree.update();
    tree.display();
}
