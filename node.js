class GenericNode {
    constructor(value) {
        this.value = value;
        this.height = 1;

        this.left = null;
        this.right = null;

        this.x = (width / 2);
        this.y = height;

        this.nx = this.x;
        this.ny = this.y;
    }

    getInorderSuccs() {
        let succ = this.right;
        let succs = [succ];

        while (succ.left != null) {
            succ = succ.left;
            succs.push(succ);
        }

        return succs;
    }

    update() {
        this.x = lerp(this.x, this.nx, 0.05);
        this.y = lerp(this.y, this.ny, 0.05);

        if (this.left != null)
            this.left.update();
        if (this.right != null)
            this.right.update();
    }

    relocateSubtree(nx, ny, width) {
        this.nx = nx;
        this.ny = ny;

        if (this.left != null) {
            let cwidth = (width / 2);
            let cnx = nx - (width / 4);
            let cny = ny + levelGap;

            this.left.relocateSubtree(cnx, cny, cwidth);
        }

        if (this.right != null) {
            let cwidth = (width / 2);
            let cnx = nx + (width / 4);
            let cny = ny + levelGap;

            this.right.relocateSubtree(cnx, cny, cwidth);
        }
    }

    updateHeight() {
        let height = 0;

        if (this.left != null)
            height = max(height, this.left.height);
        if (this.right != null)
            height = max(height, this.right.height);

        this.height = 1 + height;
    }

    print()
    {   console.log('GenericTree:', this.value);  }

    traverse() {
        if (this.left != null)
            this.left.traverse();

        this.print();

        if (this.right != null)
            this.right.traverse();
    }

    display(size) {
        stroke(0);

        fill(0);
        circle(this.x, this.y, size);
        fill(255);
        circle(this.x, this.y, size*0.95);

        fill(0);
        stroke(0);
        strokeWeight(1);
        textSize(size / 2);

        text(this.value, this.x, this.y);
    }

    displaySubtree(size) {
        stroke(0);
        if (this.left != null) {
            line(this.x, this.y, this.left.x, this.left.y);
            this.left.displaySubtree(size);
        }

        stroke(0);
        if (this.right != null) {
            line(this.x, this.y, this.right.x, this.right.y);
            this.right.displaySubtree(size);
        }

        this.display(size);
    }
}

class AVLNode extends GenericNode {
    heightDifference() {
        let delta = 0;

        if (this.left != null)
            delta += this.left.height;

        if (this.right != null)
          delta -= this.right.height;

        return delta;
    }

    print()
    {   console.log('AVLNode:', this.value);  }
}

class RedBlackNode extends GenericNode {
    constructor(value) {
        super(value);
        this.colour = RED;
        this.displayColour = RED;
    }

    print()
    {   console.log('RedBlackNode:', this.value, this.colour);  }

    display(size) {
        stroke(this.colour, 0, 0);

        fill(this.colour, 0, 0);
        circle(this.x, this.y, size);
        fill(255);
        circle(this.x, this.y, size*0.95);

        fill(this.colour, 0, 0);
        stroke(this.colour, 0, 0);
        strokeWeight(1);
        textSize(size / 2);

        text(this.value, this.x, this.y);
    }
}
