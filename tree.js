let RED   = 0;
let BLACK = 1;

let LEFT = 0;
let RIGHT = 1;

let INSERT = 0;
let DELETE = 1;

class GenericTree {
    constructor(size) {
        this.root = null;

        this.s = size;
        this.ns = this.s;

        this.rotations = [];
        this.lastOperation = null;

        this.deletedNode = null;
    }

    get height() {
        if(this.root === null)
            return 0;
        else
            return this.root.height;
    }

    get displayHeight() {
        if(this.root === null)
            return 0;
        
        let level = 1;
        let levelNodes = [this.root];
        while(true) {
            const n = levelNodes.length;
            for(let i = 0;i < n - 1;i++) {
                if((levelNodes[i] !== null && levelNodes[i - 1] !== null)) {
                    level++;
                    break;
                }
            }
            
            let nextLevel  = [];
            while(levelNodes.length > 0) {
                const node = levelNodes.shift();
                if(node === null)
                    nextLevel.push(null);

                else {
                    nextLevel.push(node.left);
                    nextLevel.push(node.right);
                }
            }

            let allNull = true;
            for(const node of nextLevel) {
                if(node !== null) {
                    allNull = false;
                    break;
                }
            }

            if(allNull)
                break;
            else
                levelNodes = [...nextLevel];
        }

        return level;
    }

    invalid(node)
    {   return false;   }

    hasPendingRotations()
    {   return (this.rotations.length > 0);   }

    removeRedundantRotations() {
        while (this.hasPendingRotations()) {
            let node = this.rotations[this.rotations.length - 1];
            node.updateHeight();
            if (this.invalid(node))
                break;
            this.rotations.pop();
        }
    }

    performRotation() {
        let changesMade = false;
        if (this.lastOperation == INSERT)
            changesMade = this.resolveInsertionRotation();

        else if (this.lastOperation == DELETE)
            changesMade = this.resolveDeletionRotation();

        if (!changesMade)
            this.lastOperation = null;
    }

    resolveInsertionRotation() {
        let node = null;
        let parent = null;

        while (this.rotations.length > 0) {
            node = this.rotations.pop();

            parent = null;
            if (this.rotations.length > 0)
                parent = this.rotations[this.rotations.length - 1];

            if (this.applyInsertionFix(node, parent))
                return true;
        }
        return false;
    }

    resolveDeletionRotation()
    {   return this.resolveInsertionRotation();   }

    newNode(value)
    {   return new GenericNode(value);  }

    addNode(value) {
        this.insert(value);
        this.lastOperation = INSERT;
    }

    removeNode(value) {
        this.delete(value);
        this.lastOperation = DELETE;
    }

    insert(value) {
        let y = null;
        let x = this.root;

        while(x != null) {
            this.rotations.push(x);
            y = x;

            if (value < x.value)
                x = x.left;
            else
                x = x.right;
        }

        if (y == null)
            this.root = this.newNode(value);
        else {
            if (value < y.value)
                y.left = this.newNode(value);
            else
                y.right = this.newNode(value);
            y.updateHeight();
        }
    }

    delete(value) {
        let y = null;
        let x = this.root;

        while(x != null) {
            if (value == x.value)
                break;

            this.rotations.push(x);
            y = x;

            if (value < x.value)
                x = x.left;
            else
                x = x.right;
        }

        if (x != null) {
            let ds = null;

            if (x.left != null && x.right != null)
                ds = x.getInorderSuccs();

            let deletedNode = null;
            let parent = null;

            if (ds == null) {
                deletedNode = x;
                parent = y;
            }

            else {
                deletedNode = ds.pop();
                x.value = deletedNode.value;

                this.rotations.concat(ds);

                parent = x;
                if (ds.length > 0)
                    parent = ds.pop();
            }

            let child = null;

            if (deletedNode.left != null)
                child = deletedNode.left;
            else if (deletedNode.right != null)
                child = deletedNode.right;

            if (parent == null)
                this.root = child;
            else {
                if (deletedNode == parent.left)
                    parent.left = child;
                else
                    parent.right = child;
            }

            deletedNode.left = null;
            deletedNode.right = null;
            this.deletedNode = deletedNode;
        }
    }

    joinWithParent(node, parent, childType) {
        if (parent == null)
            this.root = node;

        else {
            if (childType === LEFT || node.value < parent.value)
                parent.left = node;
            else
                parent.right = node;
            parent.updateHeight();
        }
    }

    applyInsertionFix(node, parent) {
        this.joinWithParent(node, parent);
        node.updateHeight();

        return false;
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

        if (this.deletedNode != null)
            this.deletedNode.display(this.s);
    }

    update() {
        this.s = lerp(this.s, this.ns, 0.2);

        if (this.root != null)
            this.root.update();

        if (this.deletedNode != null)
            this.deletedNode.update();
    }

    updateHeight() {}

    relocate() {
        if (this.root != null)
            this.root.relocateSubtree(rx, ry, rwidth);

        if (this.deletedNode != null)
            this.deletedNode.relocateSubtree(width/2, height + this.s, 0);
    }

    resize(size) {
        this.ns = size;
        this.relocate();
    }
}

class AVLTree extends GenericTree {
    newNode(value)
    {   return new AVLNode(value);  }

    invalid(node)
    {   return abs(node.heightDifference()) > 1;  }

    applyInsertionFix(node, parent) {
        let childType;
        if (parent) {
            if (parent.left === node)
                childType = LEFT;
            else
                childType = RIGHT;
        }

        let delta = node.heightDifference();
        let rotationMade = (delta > 1 || delta < -1);

        if (delta > 1) {
            delta = node.left.heightDifference();

            if(delta > 0)
                node = this.rightRotate(node);
            else {
                node.left = this.leftRotate(node.left);
                this.rotations.push(node);
            }
        }

        if(delta < -1) {
            delta = node.right.heightDifference();

            if(delta < 0)
                node = this.leftRotate(node);
            else {
                node.right = this.rightRotate(node.right);
                this.rotations.push(node);
            }
        }

        node.updateHeight();
        this.joinWithParent(node, parent, childType);

        return rotationMade;
    }
}

class RedBlackTree extends GenericTree {
    constructor(size) {
        super(size);
        this.doubleBlack = null;
    }

    invalid(node) {
        if (this.doubleBlack != null)
            return true;

        if (node == null || this.getColour(node) == RED)
            return false;

        if (this.getColour(node.left) == RED) {
            if (this.getColour(node.left.left) == RED)
                return true;
            if (this.getColour(node.left.right) == RED)
                return true;
        }

        if (this.getColour(node.right) == RED) {
            if (this.getColour(node.right.left) == RED)
                return true;
            if (this.getColour(node.right.right) == RED)
                return true;
        }

        return false;
    }

    newNode(value)
    {   return new RedBlackNode(value); }

    getColour(node) {
        if(node == null)
            return BLACK;
        return node.colour;
    }

    addNode(value) {
        super.addNode(value);
        if (this.root != null)
            this.root.colour = BLACK;
    }

    removeNode(value) {
        this.delete(value);
        this.lastOperation = DELETE;

        if (this.root != null)
            this.root.colour = BLACK;
    }

    delete(value) {
        let y = null;
        let x = this.root;

        while(x != null) {
            if (value == x.value)
                break;

            this.rotations.push(x);
            y = x;

            if (value < x.value)
                x = x.left;
            else
                x = x.right;
        }

        if (x != null) {
            let ds = null;

            if (x.left != null && x.right != null)
                ds = x.getInorderSuccs();

            let deletedNode = null;
            let parent = null;

            if (ds == null) {
                deletedNode = x;
                parent = this.rotations.pop();
            }

            else {
                deletedNode = ds.pop();
                x.value = deletedNode.value;

                ds.unshift(x);
                parent = ds.pop();

                this.rotations = this.rotations.concat(ds);
            }

            let child = null;

            if (deletedNode.left != null)
                child = deletedNode.left;
            else if (deletedNode.right != null)
                child = deletedNode.right;

            if (parent == null) {
                this.root = child;
                this.doubleBlack = null;
            }

            else {
                let doubleBlack =
                  (this.getColour(deletedNode) == BLACK &&
                   this.getColour(child) == BLACK);

                if (deletedNode == parent.left) {
                    parent.left = child;
                    if (doubleBlack)
                        this.doubleBlack = LEFT;
                }
                else {
                    parent.right = child;
                    if (doubleBlack)
                        this.doubleBlack = RIGHT;
                }

                this.rotations.push(parent);
            }

            if (child != null)
                child.colour = BLACK;

            deletedNode.left = null;
            deletedNode.right = null;
            this.deletedNode = deletedNode;
        }
    }

    applyInsertionFix(node, parent) {
        let g = node;

        if (g == null)
            return false;

        g.updateHeight();

        if(this.getColour(g) == RED)
            return false;

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
            return false;

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
                    this.rotations.push(g);

                    g.updateHeight();

                    return true;
                }
            }

            else {
                if(second_imbalance == RIGHT)
                    g = this.leftRotate(g);
                else {
                    g.right = this.rightRotate(g.right);
                    g.right.colour = RED;
                    this.rotations.push(g);

                    g.updateHeight();

                    return true;
                }
            }
        }

        g.updateHeight();
        super.joinWithParent(g, parent);
        return true;
    }

    applyDeletionFix(node, parent) {
        let p = node;

        if (p == null) {
            this.doubleBlack = null;
            return false;
        }

        p.updateHeight();
        this.joinWithParent(node, parent);

        let x = null;
        let s = null;

        if (this.doubleBlack == LEFT) {
            x = p.left;
            s = p.right;
        }

        else if (this.doubleBlack == RIGHT) {
            x = p.right;
            s = p.left;
        }

        else {
            this.doubleBlack = null;
            return false;
        }

        if (this.getColour(s) == RED) {
            if (this.doubleBlack == LEFT) {
                p = this.leftRotate(p);

                this.rotations.push(p);
                this.rotations.push(p.left);
            }

            else {
                p = this.rightRotate(p);

                this.rotations.push(p);
                this.rotations.push(p.right);
            }

            this.joinWithParent(p, parent);
            return true;
        }

        let n1 = null;
        let n2 = null;

        if (s != null) {
            n1 = s.left;
            n2 = s.right;
        }

        if (this.getColour(n1) == BLACK && this.getColour(n2) == BLACK) {
            if (s != null)
                s.colour = RED;

            if (p.colour == BLACK) {
                if (parent == null)
                    this.doubleBlack = null;
                else {
                    if (p == parent.left)
                        this.doubleBlack = LEFT;
                    else
                        this.doubleBlack = RIGHT;
                }
            }

            else {
                p.colour = BLACK;
                this.doubleBlack = null;
            }

            this.joinWithParent(p, parent);
            return true;
        }

        if (this.getColour(n2) == BLACK && this.doubleBlack == LEFT) {
            p.right = this.rightRotate(p.right);
            this.rotations.push(p);

            return true;
        }

        else if (this.getColour(n1) == BLACK && this.doubleBlack == RIGHT) {
            p.left = this.leftRotate(p.left);
            this.rotations.push(p);

            return true;
        }

        else {
            let pColour = p.colour;

            if (this.doubleBlack == LEFT) {
                p = super.leftRotate(p);
                p.colour = pColour;
                p.left.colour = BLACK;
                n2.colour = BLACK;
            }

            else {
                p = super.rightRotate(p);
                p.colour = pColour;
                p.right.colour = BLACK;
                n1.colour = BLACK;
            }

            this.doubleBlack = null;
        }

        this.joinWithParent(p, parent);
        return true;
    }

    resolveDeletionRotation() {
        let node = null;
        let parent = null;

        while (this.rotations.length > 0) {
            node = this.rotations.pop();

            let parent = null;
            if (this.rotations.length > 0)
                parent = this.rotations[this.rotations.length - 1];

            if (this.applyDeletionFix(node, parent))
                return true;
        }

        return false;
    }

    rightRotate(x) {
        // Rotation is identical to AVL, but recolouring is also required
        x.colour = RED;
        let y = super.rightRotate(x);
        y.colour = BLACK;

        return y;
    }

    leftRotate(x) {
      // Rotation is identical to AVL, but recolouring is also required
        x.colour = RED;
        let y = super.leftRotate(x);
        y.colour = BLACK;

        return y;
    }

    update() {
        if (this.root != null)
            this.root.colour = BLACK;
        super.update();
    }
}
