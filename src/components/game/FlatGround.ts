import { GameData } from '../../core/GameData';

export class FlatGround extends Phaser.GameObjects.TileSprite
{
  // *** Constructor ***
  constructor(_scene:Phaser.Scene,_x:number,_y:number)
  {
    super(_scene,_x,_y,32,32,GameData.Ground.Flat.ImageName);
    this.scaleX = 1500;
    this.scaleY = 300;
    this.tileScaleX = 0.001;
    this.tileScaleY = 0.01;
  }
}