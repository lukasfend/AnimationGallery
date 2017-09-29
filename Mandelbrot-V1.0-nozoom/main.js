window.wireFrames = true;

class MandelBrot {
  constructor(canvas) {
    setupCanvas(canvas);
    this.setup();
    this.canvas=canvas;
    this.context=canvas.getContext("2d");
    let cvs = document.createElement("canvas");
    cvs.width=window.innerWidth;
    cvs.height=window.innerHeight;
    cvs.style.position="fixed";
    cvs.style.top="0";
    cvs.style.left="0";
    cvs.style.backgroundColor="rgba(0,0,0,0)";
    document.body.appendChild(cvs);
    this.wireFrameCanvas = cvs;
    this.wireFrameContext = cvs.getContext("2d");
  }
  setup() {
    let decreaseFactor=1.3;
    this.initialRadius = 125;
    this.mandelBrotCircles = [];
    this.generations = 10;
    // Generations
    for(var i=0;i<this.generations;i++) {

      if(i==0) {
        this.mandelBrotCircles[i] = new Circle(
          parseInt(window.innerWidth/2),
          parseInt(window.innerHeight/2),
          this.initialRadius,
          0,
          i
        );

      } else {
        let beforeRadius = this.mandelBrotCircles[i-1].radius;
        let before = this.mandelBrotCircles[i-1].getAdditionalPointerPosition(beforeRadius/decreaseFactor);
        this.mandelBrotCircles[i] = new Circle(
          before.x,
          before.y,
          parseInt(beforeRadius/decreaseFactor),
          -20*i,
          i
        );

      }
      this.mandelBrotCircles[i].increase = (i+1)/1;
    }
  }
  frame() {
    this.wireFrameContext.clearRect(0,0,window.innerWidth,window.innerHeight);
    let count = 1;
    for(var circle of this.mandelBrotCircles) {
      if(window.wireFrames) {
        circle.drawWireframes(this.wireFrameContext);
        circle.next();
      }
      if(count < this.mandelBrotCircles.length-1) {
        let nextCircle = this.mandelBrotCircles[count+1];
        let beforeCircleRadius = (this.mandelBrotCircles[count-1].radius==undefined)?this.initialRadius:this.mandelBrotCircles[count-1].radius;
        let nextPos = circle.getAdditionalPointerPosition(beforeCircleRadius);
        nextCircle.x = nextPos.x;
        nextCircle.y = nextPos.y;
      }

      count++;
    }

    setTimeout(()=>{this.frame();},25);
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
    this.increase = 1;
    this.generation = generation;
  }

  next() {
    this.currentAngle+=this.increase;
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

  getAdditionalPointerPosition(x) {
    let H = this.radius+x;
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
    let opacity = (1 / (this.generation+1))/0.75;
    ctx.strokeStyle = StyleSettings.wireFrameColor.replace("{0}", opacity);
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.getPointerPosition().x,this.getPointerPosition().y);
    ctx.stroke();
    ctx.closePath();
  }
}

var app = new MandelBrot(document.getElementById("canvas"));
app.frame();
