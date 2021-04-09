let treeType = 'RB';  // set this to AVL or RB
let tree = null;

let level = 5;
let gap = 10;
let size, levelGap;

let rx, ry, rwidth;
let borderX, borderY;

let FPS = 60;

let textBox;
let buttonEnabled = true;

function clearTree() {
    tree.root.relocateSubtree(width/2, height + tree.s, width);   
}

function selectTree() {
    if (treeType == 'AVL')
        tree = new AVLTree(size);
    else if (treeType == 'RB')
        tree =  new RedBlackTree(size);
}

function toggleTree() {
    console.log("Toggle tree");
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
    textBox.focus();
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

        let value = parseInt(textBox.value);
        textBox.value = '';

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

        let value = parseInt(textBox.value);
        textBox.value = '';

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

function init() {
    borderX = 0.025 * width;
    borderY = 0.025 * height;

    let n = Math.pow(2, level - 1);
    size = ((width - 2*borderX) - (n - 1) * gap) / n;
    levelGap = (height - 2*borderY) / (level + 2);

    rx = (width / 2);
    ry = (borderY + levelGap + size/2);
    rwidth = (width - 2*borderX);

    if(tree !== null) {
        tree.relocate();
        tree.resize(size);
    }
}

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
    
    textAlign(CENTER, CENTER);
    frameRate(FPS);

    textBox = document.querySelector("#input");
    textBox.focus();

    init();
    selectTree();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    init();
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

function submitForm(event) {
    event.preventDefault();
    insertNode();
    return false;
}