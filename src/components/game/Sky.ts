import { GameData } from '../../core/GameData';
import { CloudPositioner } from '../../core/CloudPositioner';
import { Player } from '../../components/game/Player'

export class Sky extends Phaser.GameObjects.Container {

  // *** Fields ***
  private skySprite!: Phaser.GameObjects.Sprite;
  private cloudPositioner!: CloudPositioner;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number, _cloudPositioner: CloudPositioner) {
    super(_scene, _x, _y);

    this.skySprite = this.scene.add.sprite(0, _y - 8000, GameData.Sky.Default.ImageName);
    this.skySprite.scrollFactorX = 0;
    this.skySprite.scrollFactorY = 0.022;
    this.skySprite.scaleX = 10000;
    this.skySprite.scaleY = 10;

    this.cloudPositioner = _cloudPositioner;

    this.cloudPositioner.addLowAltitudeCloud(GameData.Sky.CloudLow1.ImageName);
    this.cloudPositioner.addLowAltitudeCloud(GameData.Sky.CloudLow2.ImageName);
    this.cloudPositioner.addLowAltitudeCloud(GameData.Sky.CloudLow3.ImageName);
    this.cloudPositioner.addLowAltitudeCloud(GameData.Sky.CloudLow4.ImageName);
    this.cloudPositioner.addLowAltitudeCloud(GameData.Sky.CloudLow5.ImageName);

  }

  // *** Update ***
  public update(player:Player,time:number){
    this.cloudPositioner.update(player,time);
  }


}