import { GameData } from "../../core/GameData";
import { MathUtils } from "../../core/MathUtils";

export class GuiBooster extends Phaser.GameObjects.Container{

  // *** Fields ***
  private text!:Phaser.GameObjects.Text;
  private boosterBody!: Phaser.GameObjects.Sprite;
  private boosterNeedle!: Phaser.GameObjects.Sprite;
  private boosterTemperatureNeedle!:Phaser.GameObjects.Sprite;

  private boster:number = 0;
  private maxBooster:number = 0;
  private boosterTemperature:number = 0;
  private boosterMaxTemperature:number = 0;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number)
  {
    super(_scene, _x, _y);

    this.boosterBody = this.scene.add.sprite(
      _x,_y,
      GameData.Gui.BoosterBody.ImageName);
    this.boosterBody.setScale(0.5);
    this.boosterNeedle = this.scene.add.sprite(
      _x,_y,
      GameData.Gui.BoosterNeedle.ImageName);
      this.boosterNeedle.setScale(0.5);
    this.boosterTemperatureNeedle = this.scene.add.sprite(
      _x,_y,
      GameData.Gui.BoosterTemperatureNeedle.ImageName);
    this.boosterTemperatureNeedle.setScale(0.5);
  }

  // *** Controller ***
  public setBooster(booster:number,maxBooster:number){
    this.boster = booster;
    this.maxBooster = maxBooster;
    this.updateNeedles();
  }

  public setBoosterTemperature(boosterTemperature:number,maxBoosterTemperature:number){
    this.boosterTemperature = boosterTemperature;
    this.boosterMaxTemperature = maxBoosterTemperature;
    this.updateNeedles();
  }

  // *** Update ***
  private updateNeedles(){

    var angleFactor = 2.4;

    var boosterNeedle = MathUtils.Map(this.boster,0,this.maxBooster,-angleFactor,angleFactor);
    if( boosterNeedle < -angleFactor ) boosterNeedle = -angleFactor;
    if( boosterNeedle > angleFactor ) boosterNeedle = angleFactor;

    var boosterTemperatureNeedle = MathUtils.Map(this.boosterTemperature,0,this.boosterMaxTemperature,-angleFactor,angleFactor);
    if( boosterTemperatureNeedle < -angleFactor ) boosterTemperatureNeedle = -angleFactor;
    if( boosterTemperatureNeedle > angleFactor ) boosterTemperatureNeedle = angleFactor;

    this.boosterNeedle.rotation = boosterNeedle;
    this.boosterTemperatureNeedle.rotation = boosterTemperatureNeedle;

  }

}