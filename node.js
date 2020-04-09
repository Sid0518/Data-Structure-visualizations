class Tree {
    constructor()
    { this.root = null; }

    addNode(value) {
        let temp = this.insert(this.root, value);
        this.root = temp[0];

        return temp[1];
    }

    insert(node, value, pos = 0) {
        if(node == null) {
            let new_node = new Node(value, pos);
            return [new_node, [new_node]];
        }

        let nodes = [];
        if (value < node.value) {
            let temp = this.insert(node.left, value, 2*pos + 1);
            node.left = temp[0];
            nodes = temp[1];
        }
        else if(value > node.value) {
            let temp = this.insert(node.right, value, 2*pos + 2);
            node.right = temp[0];
            nodes = temp[1];
        }

        nodes.push(node);
        node = this.balance(node);

        return [node, nodes];
    }

    balance(node) {
        let delta = node.heightDifference();
        if (delta > 1) {
            delta = node.left.heightDifference();

            if(delta > 0)
                node = this.rightRotate(node);
            else
                node = this.leftRightRotate(node);
        }

        if(delta < -1) {
            delta = node.right.heightDifference();

            if(delta < 0)
                node = this.leftRotate(node);
            else
                node = this.rightLeftRotate(node);
        }

        node.updateHeight();
        return node;
    }

    leftOf(pos)
    { return 2*pos + 1; }

    rightOf(pos)
    { return 2*pos + 2; }

    parentOf(pos)
    { return floor((pos - 1)/2); }

    rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        y.right = x;

        x.updateHeight();
        y.updateHeight();

        y.updatePosition(this.parentOf(y.pos));

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

      y.updatePosition(this.parentOf(y.pos));

      return y;
    }

    rightLeftRotate(x) {
        x.right = this.rightRotate(x.right);
        return this.leftRotate(x);
    }

    traverse()
    { this.root.traverse(); }

    display(size)
    { this.root.display(size); }

    update()
    { return this.root.update(); }
}

class Node {
    constructor(value, pos) {
        this.value = value;
        this.pos = pos;

        this.left = null;
        this.right = null;

        this.x = random(width);
        this.y = -height/10;

        this.vx = 0;
        this.vy = 0;
        this.updatePosition(this.pos);

        this.height = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        let dx = abs(this.x - positions[this.pos][0]);
        let dy = abs(this.y - positions[this.pos][1]);
        if(dx <= 0.005 && dy <= 0.005 ) {
            this.vx = 0;
            this.vy = 0;
        }

        let a = 1;
        let b = 1;
        if (this.left != null)
            a = this.left.update();
        if (this.right != null)
            b = this.right.update();

        return a && b && this.vx == 0 && this.vy == 0;
    }

    updatePosition(new_position) {
        this.pos = new_position;

        let target_pos = [width/2, -height/10];
        if(this.pos < positions.length)
            target_pos = positions[this.pos];
        else
            console.log('Node has exceeded maximum allowed depth');

        this.vx = (target_pos[0] - this.x) / animationSteps;
        this.vy = (target_pos[1] - this.y) / animationSteps;

        if (this.left != null)
            this.left.updatePosition(2*this.pos + 1);
        if (this.right != null)
            this.right.updatePosition(2*this.pos + 2);
    }

    heightDifference() {
        let delta = 0;

        if (this.left != null)
            delta += this.left.height;

        if (this.right != null)
          delta -= this.right.height;

        return delta;
    }

    updateHeight() {
        let height = 0;

        if (this.left != null)
            height = max(height, this.left.height);
        if (this.right != null)
            height = max(height, this.right.height);

        this.height = 1 + height;
    }

    traverse() {
        if (this.left != null)
            this.left.traverse();

        print(this.value);

        if (this.right != null)
            this.right.traverse();
    }

    display(size) {
        if (this.left != null) {
            line(this.x, this.y, this.left.x, this.left.y);
            this.left.display(size);
        }
        if (this.right != null) {
            line(this.x, this.y, this.right.x, this.right.y);
            this.right.display(size);
        }
        fill(255);
            circle(this.x, this.y, size);
        fill(0);
            text(this.value, this.x, this.y);
    }
}
