class Angle {
  constructor(angle) {
    this.setAngle(angle);
  }
  getEndCoordinates(length, startCoordinates) {
    // Offset on Y axis
    let offsetY = length * Math.cos(this.angle); //AK = H * cos(x)
    let offsetX = length * Math.sin(this.angle); //GK = H * sin(x)
    return {
      x: startCoordinates.x+offsetX,
      y: startCoordinates.y+offsetY
    };
  }
  setAngle(angle) {
    let factor = angle / 180;
    let effectiveAngle = factor * Math.PI;
    this.angle = effectiveAngle;
    this.rawAngle = angle;
  }
  setAngleRadiant(angle) {
    this.angle = angle;
  }
  get() {
    return this.rawAngle;
  }
}
