class FractalTree {
  constructor(canvas) {
    // custom method to call it manually
    this.setup(canvas);
  }
  setup(canvas) {
    this.canvas = canvas;
    setupCanvas(canvas);
    this.context = canvas.getContext("2d");
    // Options
    // Start of with one branch that is in the center
    // bottom of the page.
    this.branches = [new Branch(
      // X: the middle of the page, but we don't want to have decimals.
      parseInt(this.canvas.width/2),
      // Bottom of the page
      this.canvas.height,
      180 // Start off with no rotation of the branch
    )];

    // Okay, we have the branch now,
    // but we also need to make some settings
    // to change the look of the tree.
    // Since we maybe want to implement something
    // like a slider, this should be kinda dynamic.

    // When a branch splits, we want the new ones
    // to split 20° to the left and right
    this.branchSplitAngle = 20;
    // The first branch is 50 px long
    this.firstBranchLength = 150;

    // The following values will make the tree look
    // better, however if you want to disable them
    // simply set them to 1.

    // The multiplicator for the angle after each
    // generation
    this.branchSplitMultiplicator = 1.0;

    // The multiplicator for the length of the
    // branch generations.
    this.branchLengthMultiplicator = 0.75;

    this.generation=0;//for stopping somewhen
    this.stopGeneration = 13;
  }
  frame() {
    if(this.generation>=this.stopGeneration) {
      return;
    }
    this.generation++;
    let newBranches=[];
    for(let branch of this.branches) {
      // Draw current branch
      let coords = branch.draw(this.context, this.firstBranchLength);
      let leftBranch = new Branch(
        coords.x,
        coords.y,
        branch.angle.get() + this.branchSplitAngle
      );
      let rightBranch = new Branch(
        coords.x,
        coords.y,
        branch.angle.get() - this.branchSplitAngle
      );
      newBranches.push(leftBranch,rightBranch);
    }
    this.branches = newBranches;
    this.firstBranchLength *= this.branchLengthMultiplicator;
    this.branchSplitAngle *= this.branchSplitMultiplicator;
    setTimeout(()=>{this.frame();},1);
  }
}
var StyleSettings = {
  branch: {
    color: "rgba(255,255,255,0.75)",
    width: 2
  }
};
class Branch {
  constructor(x,y,angle) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.angle = new Angle(angle);
  }
  // Draws the branch
  draw(context, length) {
    let endCoords = this.angle.getEndCoordinates(length, {x:this.x,y:this.y});
    context.beginPath();
    context.strokeStyle = StyleSettings.branch.color;
    context.lineWidth = StyleSettings.branch.width;
    context.moveTo(this.x,this.y);
    context.lineTo(
      endCoords.x,
      endCoords.y
    );
    context.stroke();
    context.closePath();
    return endCoords;
  }
}
let canvas=document.getElementById("canvas")
var Animation = new FractalTree(canvas);
Animation.frame();

function splitMultChange() {
  Animation.setup(canvas);
  Animation.branchSplitMultiplicator = document.getElementById("split").value;
  Animation.firstBranchLength = document.getElementById("size").value;
  Animation.branchLengthMultiplicator = document.getElementById("lenmul").value;
  Animation.frame();
}
