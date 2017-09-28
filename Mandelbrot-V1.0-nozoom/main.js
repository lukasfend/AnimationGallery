window.wireFrames = true;

class MandelBrot {
  constructor(canvas) {
    setupCanvas(canvas);
    this.setup();
    this.canvas=canvas;
    this.context=canvas.getContext("2d");
  }
  setup() {
    let decreaseFactor=1.3;
    this.mandelBrotCircles = [];
    this.generations = 10;
    // Generations
    for(var i=0;i<this.generations;i++) {
      if(i==0) {
        this.mandelBrotCircles[i] = new Circle(
          parseInt(window.innerWidth/2),
          parseInt(window.innerHeight/2),
          175,
          0,
          i
        );
      } else {
        let before = this.mandelBrotCircles[i-1].getPointerPosition();
        let beforeRadius = this.mandelBrotCircles[i-1].radius;
        this.mandelBrotCircles[i] = new Circle(
          before.x,
          before.y,
          parseInt(beforeRadius/decreaseFactor),
          -20*i,
          i
        );
      }
    }
  }
  frame() {
    for(var circle of this.mandelBrotCircles) {
      if(window.wireFrames) {
        circle.drawWireframes(this.context);
      }
    }
  }
}
var StyleSettings = {
  wireFrameColor: "rgba(0, 171, 255, {0})"
};
class Circle {
  constructor(x,y,radius,angle=0, generation=0) {
    this.x=x;
    this.y=y;
    this.currentAngle = angle;
    this.radius = radius;
    this.generation = generation;
  }

  getPointerPosition() {
    let H = this.radius;
    let RADIANT_ANGLE = (this.currentAngle/180)*Math.PI;
    let AK = H * Math.sin(RADIANT_ANGLE);
    let GK = H * Math.cos(RADIANT_ANGLE);
    return {
      x: this.x+GK,
      y: this.y+AK
    };
  }

  drawWireframes(ctx) {
    ctx.beginPath();
    let opacity = (1 / (this.generation+1));
    ctx.strokeStyle = StyleSettings.wireFrameColor.replace("{0}", opacity);
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
}

var app = new MandelBrot(document.getElementById("canvas"));
app.frame();
