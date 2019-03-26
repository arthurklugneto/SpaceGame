export class Force extends Phaser.Math.Vector2 {

  // *** Constructor ***
  constructor(_x: number, _y: number) {
    super(_x, _y);
  }

  // *** Multiply by Scalar ***
  mul(value: number) {
    this.x *= value;
    this.y *= value;
  }

  // *** Divide by Scalar ***
  div(value: number) {
    this.x /= value;
    this.y /= value;
  }

  // *** Multiply by Scalar in new Vector ***
  outMul(value: number): Force {
    var xCalc = this.x * value;
    var yCalc = this.y * value;
    return new Force(xCalc, yCalc);
  }

  // *** Divide by Scalar in new Vector ***
  outDiv(value: number): Force {
    var xCalc = this.x / value;
    var yCalc = this.y / value;
    return new Force(xCalc, yCalc);
  }

}