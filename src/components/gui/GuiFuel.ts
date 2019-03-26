import { MathUtils } from '../../core/MathUtils';
import { GameData } from "../../core/GameData";

export class GuiFuel extends Phaser.GameObjects.Container{

  // *** Fields ***
  private fuelBody!: Phaser.GameObjects.Sprite;
  private fuelNedle!: Phaser.GameObjects.Sprite;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number)
  {
    super(_scene, _x, _y);

    this.fuelBody = this.scene.add.sprite(_x,_y,GameData.Gui.FuelBody.ImageName);

    this.fuelNedle =  this.scene.add.sprite(
      _x,_y,
      GameData.Gui.AtmosphereNedle.ImageName);
    this.fuelNedle.setScale(0.5);
    this.fuelBody.setScale(0.5);
  }

  // *** Controller ***
  setFuel(value:number,maxValue:number)
  {
    var needle = MathUtils.Map(value,0,maxValue,-2.6,2.6);
    if( needle < -2.6 ) needle = -2.6;
    if( needle > 2.6 ) needle = 2.6
    this.fuelNedle.rotation = needle;
  }

}