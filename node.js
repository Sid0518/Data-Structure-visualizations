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
        this.x = lerp(this.x, this.nx, 0.08);
        this.y = lerp(this.y, this.ny, 0.08);

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
            height = Math.max(height, this.left.height);
        if (this.right != null)
            height = Math.max(height, this.right.height);

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
        stroke(250);

        fill(250);
        circle(this.x, this.y, size);
        fill(51);
        circle(this.x, this.y, size*0.95);

        fill(250);
        stroke(250);
        strokeWeight(1);
        
        textSize(size / 2);
        text(this.value, this.x, this.y);
    }

    displaySubtree(size) {
        stroke(DARK_MODE ? 245 : 51);
        if (this.left != null) {
            line(this.x, this.y, this.left.x, this.left.y);
            this.left.displaySubtree(size);
        }
        
        stroke(DARK_MODE ? 245 : 51);
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
        const colour = 
            (this.colour === RED) ? 
                [255, 23, 68, 255] :
                DARK_MODE ? 
                    [245, 245, 245, 255] : 
                    [0, 0, 0, 255]

        stroke(colour);

        fill(colour);
        circle(this.x, this.y, size);
        fill(DARK_MODE ? 51 : 245);
        circle(this.x, this.y, size*0.95);

        fill(colour);
        stroke(colour);
        strokeWeight(1);
        textSize(size / 2);

        text(this.value, this.x, this.y);
    }
}
