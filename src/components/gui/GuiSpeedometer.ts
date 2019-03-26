import { GameData } from "../../core/GameData";
import { MathUtils } from "../../core/MathUtils";

export class GuiSpeedometer extends Phaser.GameObjects.Container{

  // *** Fields ***
  private speedometerBody!: Phaser.GameObjects.Sprite;
  private speedometerSpeedNeedle!: Phaser.GameObjects.Sprite;
  private speedometerVerticalSpeedNeedle!:Phaser.GameObjects.Sprite;

  private speed:number = 0;
  private verticalSpeed:number = 0;
  private maxSpeed:number = 5;
  private maxVerticalSpeed:number = 5;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number)
  {
    super(_scene, _x, _y);

    this.speedometerBody =  this.scene.add.sprite(
      _x,_y,
      GameData.Gui.SpeedometerBody.ImageName);
    this.speedometerSpeedNeedle =  this.scene.add.sprite(
      _x,_y,
      GameData.Gui.SpeedometerSpeedNeedle.ImageName);
    this.speedometerVerticalSpeedNeedle =  this.scene.add.sprite(
      _x,_y,
      GameData.Gui.SpeedometerVerticalSpeedNeedle.ImageName);
  }

  // *** Controller ***
  public setSpeed(value:number){
    this.speed = value;
    this.updateNeedles();
  }

  public setVerticalSpeed(value:number){
    this.verticalSpeed = value;
    this.updateNeedles();
  }

  // *** Update ***
  private updateNeedles(){

    var angleFactor = 2;
    var speedNeedle = MathUtils.Map(this.speed,0,this.maxSpeed,-angleFactor,angleFactor);
    if( speedNeedle < -angleFactor ) speedNeedle = -angleFactor;
    if( speedNeedle > angleFactor ) speedNeedle = angleFactor;

    var verticalSpeedNeedle = MathUtils.Map(this.verticalSpeed,0,this.maxSpeed,-angleFactor,angleFactor);
    if( verticalSpeedNeedle < -angleFactor ) verticalSpeedNeedle = -angleFactor;
    if( verticalSpeedNeedle > angleFactor ) verticalSpeedNeedle = angleFactor;

    this.speedometerSpeedNeedle.rotation = speedNeedle;
    this.speedometerVerticalSpeedNeedle.rotation = verticalSpeedNeedle;
  }

}