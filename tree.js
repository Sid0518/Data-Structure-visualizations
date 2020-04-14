let RED = '#FF0000';
let BLACK = '#000000';

let LEFT = 0;
let RIGHT = 1;

class GenericTree {
    constructor(size) {
        this.root = null;

        this.s = size;
        this.ns = this.s;
        this.vs = 0;
    }

    newNode(value)
    {   return new GenericNode(value);  }

    addNode(value) {
        let nodes = this.insert(this.root, value);

        this.root = nodes[nodes.length - 1];
        this.root.updatePositions(rbegin, rwidth, rx, ry);

        return nodes;
    }

    insert(node, value) {
        if(node == null)
            return [this.newNode(value)];

        let nodes = [];
        if(value < node.value) {
            nodes = this.insert(node.left, value);

            let left = nodes[nodes.length - 1];
            node.left = left;
        }

        else {
            nodes = this.insert(node.right, value);

            let right = nodes[nodes.length - 1];
            node.right = right;
        }
        nodes.push(node);

        return nodes;
    }

    applyFix(node) {
        node.updateHeight();
        return [null, false];
    }

    rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        y.right = x;

        x.updateHeight();
        y.updateHeight();

        return y;
    }

    leftRightRotate(x) {
        x.left = this.leftRotate(x.left);
        return this.rightRotate(x);
    }

    leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        y.left = x;

        x.updateHeight();
        y.updateHeight();

        return y;
    }

    rightLeftRotate(x) {
        x.right = this.rightRotate(x.right);
        return this.leftRotate(x);
    }

    traverse() {
        if (this.root != null)
            this.root.traverse();
    }

    display() {
        if (this.root != null)
            this.root.displaySubtree(this.s);
    }

    update() {
        this.s += this.vs;

        let ds = abs(this.ns - this.s);
        if (ds < 1) {
            this.vs = 0;
            this.s = this.ns;
        }

        if (this.root != null)
            this.root.update();
    }

    updateSize(size) {
        this.ns = size;
        this.vs = (this.ns - this.s) / animSteps;
    }
}

class AVLTree extends GenericTree {
    newNode(value)
    {   return new AVLNode(value);  }

    applyFix(node) {
        let delta = node.heightDifference();
        let rotation_made = (delta > 1 || delta < -1);

        if (delta > 1) {
            delta = node.left.heightDifference();

            if(delta > 0)
                node = this.rightRotate(node);
            else
                node.left = this.leftRotate(node.left);
                // delay a full 2-step rotation
        }

        if(delta < -1) {
            delta = node.right.heightDifference();

            if(delta < 0)
                node = this.leftRotate(node);
            else
                node.right = this.rightRotate(node.right);
                // delay a full 2-step rotation
        }
        node.updateHeight();

        return [node, rotation_made];
    }
}

class RedBlackTree extends GenericTree {
    newNode(value)
    {   return new RedBlackNode(value); }

    getColour(node) {
        if(node == null)
            return BLACK;
        return node.colour;
    }

    addNode(value) {
	      let nodes = super.addNode(value);
        this.root.colour = BLACK;

        return nodes;
    }

    applyFix(node) {
        let g = node;
        g.updateHeight();

        if(g == null || this.getColour(g) == RED)
            return [g, false];

        let p = null;
        let u = null;
        let x = null;

        let first_imbalance = null;
        let second_imbalance = null;

        if(first_imbalance == null || second_imbalance == null) {
            if(this.getColour(g.left) == RED) {
                first_imbalance = LEFT;
                p = g.left; u = g.right;

                if(this.getColour(p.left) == RED) {
                    second_imbalance = LEFT;
                    x = p.left;
                }

                if(this.getColour(p.right) == RED) {
                    second_imbalance = RIGHT;
                    x = p.right;
                }
            }
        }

        if(first_imbalance == null || second_imbalance == null) {
            if(this.getColour(g.right) == RED) {
                first_imbalance = RIGHT;
                p = g.right; u = g.left;

                if(this.getColour(p.left) == RED) {
                    second_imbalance = LEFT;
                    x = p.left;
                }

                if(this.getColour(p.right) == RED) {
                    second_imbalance = RIGHT;
                    x = p.right;
                }
            }
        }

        if(first_imbalance == null || second_imbalance == null)
            return [g, false];

        if(this.getColour(u) == RED) {
            g.colour = RED;
            p.colour = BLACK;
            u.colour = BLACK;
        }

        else {
            if(first_imbalance == LEFT) {
                if(second_imbalance == LEFT)
                    g = this.rightRotate(g);
                else {
                    g.left = this.leftRotate(g.left);
                    g.left.colour = RED;
                }
            }

            else {
                if(second_imbalance == RIGHT)
                    g = this.leftRotate(g);
                else {
                    g.right = this.rightRotate(g.right);
                    g.right.colour = RED;
                }
            }
        }

        g.updateHeight();

        return [g, true];
    }

    rightRotate(x) {
        x.colour = RED;
        let y = super.rightRotate(x);
        y.colour = BLACK;

        return y;
    }

    leftRotate(x) {
        x.colour = RED;
        let y = super.leftRotate(x);
        y.colour = BLACK;

        return y;
    }

    update() {
        this.root.colour = BLACK;
        super.update();
    }
}
