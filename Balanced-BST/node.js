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

        this.vx = 0;
        this.vy = 0;

        this.begin = 0;
        this.width = width;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        let dx = abs(this.nx - this.x);
        let dy = abs(this.ny - this.y);
        if (dx < 1 && dy < 1) {
            this.vx = 0;
            this.vy = 0;
        }

        if (this.left != null)
            this.left.update();
        if (this.right != null)
            this.right.update();
    }

    updatePositions(begin, width, nx, ny) {
        this.begin = begin;
        this.width = width;

        this.nx = nx;
        this.ny = ny;

        this.vx = (this.nx - this.x) / animSteps;
        this.vy = (this.ny - this.y) / animSteps;

        if (this.left != null) {
            let cbegin = begin;
            let cwidth = (width / 2);
            let cnx = nx - (width / 4);
            let cny = ny + levelGap;

            this.left.updatePositions(cbegin, cwidth, cnx, cny);
        }

        if (this.right != null) {
            let cbegin = begin + (width / 2);
            let cwidth = (width / 2);
            let cnx = nx + (width / 4);
            let cny = ny + levelGap;

            this.right.updatePositions(cbegin, cwidth, cnx, cny);
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
        fill(255);
        stroke(0);
            circle(this.x, this.y, size);

        fill(0);
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
    }

    print()
    {   console.log('RedBlackNode:', this.value, this.colour);  }

    display(size) {
        fill(255);
        stroke(this.colour);
            circle(this.x, this.y, size);

        fill(this.colour);
        textSize(size / 2);
            text(this.value, this.x, this.y);
    }
}
