let treeType = 'RB';  // set this to AVL or RB
let tree = null;

let level = 5;
let size, levelGap;
let rx, ry, rwidth;

let buttonsEnabled = true;
let autoInsert = false;

function clearTree() {
    tree.root.relocateSubtree(width/2, height + tree.s, width);   
}

function selectTree() {
    const heading = document.querySelector("#heading");
    const changeTreeButton = document.querySelector("#toggle");

    if (treeType === 'AVL') {
        tree = new AVLTree(size);
        heading.innerHTML = "AVL Tree Visualization";
        changeTreeButton.innerHTML = "Switch to Red-Black Tree";
    }
    else if (treeType === 'RB') {
        tree =  new RedBlackTree(size);
        heading.innerHTML = `
            <span style='color: rgb(255, 23, 68);'>Red</span>
            <span style='color: black;'><strike>Black</strike></span>
            White Tree Visualization
        `;
        changeTreeButton.innerHTML = "Switch to AVL Tree";  
    }

    enableButtons();
}

function toggleTree() {
    if (buttonsEnabled) {
        buttonsEnabled = false;

        if (treeType == 'AVL')
            treeType = 'RB';
        else if (treeType == 'RB')
            treeType = 'AVL';

        if (tree != null && tree.root != null) {
            clearTree();
            window.setTimeout(selectTree, 1000);
        }

        else
            selectTree();
    }
}

const inputIds = ["toggle", "input", "insert", "delete", "auto"];
function disableButtons() {
    buttonsEnabled = false;
    for(const id of inputIds)
        document.getElementById(id).disabled = true;
}

function enableButtons() {
    buttonsEnabled = true;

    if(!autoInsert) {
        for(const id of inputIds)
            document.getElementById(id).disabled = false;

        const textBox = document.querySelector("#input");
        textBox.focus();
    }
}

function continueOperation() {
    tree.relocate();
    tree.removeRedundantRotations();
    if (tree.hasPendingRotations())
        window.setTimeout(performRotations, 1000);
    else
        window.setTimeout(enableButtons, 1000);
}

function performRotations() {
    tree.performRotation();
    continueOperation();
}

function insertNode() {
    disableButtons();

    const textBox = document.querySelector("#input");
    const value = parseInt(textBox.value);
    textBox.value = '';

    if (!isNaN(value)) {
        tree.addNode(value);
        continueOperation();
    }
    else {
        alert('Please enter an integer.');
        enableButtons();
    }
}

function removeNode() {
    disableButtons();

    const textBox = document.querySelector("#input");
    const value = parseInt(textBox.value);
    textBox.value = '';

    if (!isNaN(value)) {
        tree.removeNode(value);
        continueOperation();
    }
    else {
        alert('Please enter an integer');
        enableButtons();
    }
}

function toggleAutoFill() {
    const autoFillButton = document.querySelector("#auto");
    const textBox = document.querySelector("#input");
    const ids = ["toggle", "input", "insert", "delete"];
    
    if(!autoInsert) {
        autoFillButton.innerHTML = "Stop auto-filling";
        textBox.blur();
        for(const id of ids)
            document.getElementById(id).disabled = true;

        autoInsert = true;
    }
    else {
        autoFillButton.innerHTML = "Auto-fill nodes";
        textBox.focus();
        for(const id of ids)
            document.getElementById(id).disabled = false;

        autoInsert = false;
    }
}

function init() {
    let n = Math.pow(2, level - 1);
    levelGap = height / (level + 2);
    size = Math.min(levelGap - 8, width / n);

    rx = (width / 2);
    ry = (size / 2) + 8;
    rwidth = width;

    if(tree !== null) {
        tree.relocate();
        tree.resize(size);
    }
}

function setup() {
    const div = document.querySelector("#canvas-wrapper");
    const canvas = createCanvas(div.offsetWidth - 32, div.offsetHeight - 32);
    canvas.parent(div);
    
    textAlign(CENTER, CENTER);
    frameRate(FPS);

    const textBox = document.querySelector("#input");
    textBox.focus();

    if(DARK_MODE) {
        const body = document.querySelector("body");
        for(const id of inputIds)
            document.getElementById(id).classList.add("dark-input");
        body.classList.add("dark-body");
    }

    init();
    selectTree();
}

function windowResized() {
    const div = document.querySelector("#canvas-wrapper");
    resizeCanvas(div.offsetWidth - 32, div.offsetHeight - 32);
    init();
}

function draw() {
    background(DARK_MODE ? 51 : 245);

    let newLevel = max(5, tree.displayHeight);
    if (level !== newLevel) {
        level = newLevel;
        init();
    }

    tree.update();
    tree.display();

    if(autoInsert && buttonsEnabled) {
        buttonsEnabled = false;

        const value = -100 + Math.round(Math.random() * 200);
        tree.addNode(value);
        continueOperation();
    }
}

function submitForm(event) {
    event.preventDefault();
    insertNode();
    return false;
}