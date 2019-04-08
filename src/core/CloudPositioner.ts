import { Player } from '../components/game/Player'
import { Constants } from './Constants';
import { MathUtils } from './MathUtils';
import { Md5 } from 'ts-md5/dist/md5';
import OpenSimplexNoise from 'open-simplex-noise';
import OpenSimplexNoise from 'pen-simplex-noise/lib';

export class CloudPositioner extends Phaser.GameObjects.Container {

  // *** Fields ***
  private lowAltitudeCloudSprite: string[] = [];
  private middleAltitudeCloudSprite: string[] = [];
  private highAltitudeCloudSprite: string[] = [];
  private clouds: string[] = [];
  private initialPositionedClouds: boolean = false;
  private noise!: OpenSimplexNoise;

  private Width: number = 0;
  private Height: number = 0;
  private HalfWidth: number = 0;
  private HalfHeight: number = 0;
  private MarginWidth: number = 0;
  private MarginHeight: number = 0;
  private cloudGenerationStep: number = 10;
  private cloudGenerationProbability: number = 0.82;
  private maxCloudSizeMultiplyer = 3;
  private minCloudOpacity = 0.1;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number) {
    super(_scene, _x, _y);

    // create simplex noise generator
    this.noise = new OpenSimplexNoise(0);

    // define screen size
    let { width, height } = this.scene.game.canvas;

    this.Width = width;
    this.Height = height;
    this.HalfWidth = Math.floor(this.Width / 2);
    this.HalfHeight = Math.floor(this.Height / 2);
    this.MarginWidth = 500;
    this.MarginHeight = 500;

  }

  // *** Update ***
  public update(player: Player, time: number) {

    // generate the initial low altitude clouds
    if (!this.initialPositionedClouds) {
      this.createInitialClouds(player.x, player.y);
    }

    //remove clouds outside de bounds
    for (var i = 0; i < this.clouds.length; i++) {
      var cloud = this.scene.children.getByName(this.clouds[i]) as Phaser.GameObjects.Sprite;
      if (cloud != null) {
        if (this.isCloudOutsideBounds(cloud, player)) {
          this.createCloud(player,cloud);
          cloud.destroy();
          this.removeCloud(this.clouds[i]);
        }
      }
    }

  }

  // *** Methods ***
  public addLowAltitudeCloud(imageName: string) {
    this.lowAltitudeCloudSprite.push(imageName);
  }

  public addMiddleAltitudeCloud(imageName: string) {
    this.middleAltitudeCloudSprite.push(imageName);
  }

  public addHighAltitudeCloud(imageName: string) {
    this.highAltitudeCloudSprite.push(imageName);
  }

  private createInitialClouds(playerX: number, playerY: number) {

    for (var w = playerX - (this.HalfWidth + this.MarginWidth); w < playerX + (this.HalfWidth + this.MarginWidth); w += this.cloudGenerationStep) {
      for (var h = playerY - (this.HalfHeight + this.MarginHeight); h < playerY + (this.HalfHeight + this.MarginHeight); h += this.cloudGenerationStep) {
        if (this.noise.noise2D(w / this.cloudGenerationStep, h / this.cloudGenerationStep) > this.cloudGenerationProbability) {
          var cloudName = 'Cloud.Low.#' + Md5.hashStr(Date.now() + ":" + Math.random());
          var cloudIndex = Math.floor(Math.random() * this.lowAltitudeCloudSprite.length);

          var cloud = new Phaser.GameObjects.Sprite(
            this.scene,
            w, h,
            this.lowAltitudeCloudSprite[cloudIndex]);

          cloud.setName(cloudName);
          cloud.setScale(MathUtils.randomFloatBetween(1,this.maxCloudSizeMultiplyer));
          cloud.setAlpha(MathUtils.randomFloatBetween(this.minCloudOpacity,1));
          this.scene.add.existing(cloud);
          this.clouds.push(cloudName);
        }
      }
    }

    this.initialPositionedClouds = true;

  }

  private isCloudOutsideBounds(cloud: Phaser.GameObjects.Sprite, player: Player): boolean {
    var distanceToPlayer = this.distanceBetweenCloudAndPlayer(player.x, player.y, cloud.x, cloud.y);
    return distanceToPlayer > 1000;
  }

  private removeCloud(cloud: string) {
    var index = this.clouds.indexOf(cloud);
    if (index !== -1) {
      this.clouds.splice(index, 1);
    }
  }

  private createCloud(player: Player, oldCloud: Phaser.GameObjects.Sprite) {
    var cloudName = 'Cloud.Low.#' + Md5.hashStr(Date.now() + ":" + Math.random());
    var cloudIndex = Math.floor(Math.random() * this.lowAltitudeCloudSprite.length);

    var dx = Math.abs(player.x - oldCloud.x);
    var dy = Math.abs(player.y - oldCloud.y);

    var newX = oldCloud.x < player.x ? dx : -dx;
    var newY = oldCloud.y < player.y ? dy : -dy;

    var cloud = new Phaser.GameObjects.Sprite(
      this.scene,
      player.x+newX,player.y+newY,
      this.lowAltitudeCloudSprite[cloudIndex]);

    cloud.setName(cloudName);
    cloud.setScale(MathUtils.randomFloatBetween(1,this.maxCloudSizeMultiplyer));
    cloud.setAlpha(MathUtils.randomFloatBetween(this.minCloudOpacity,1));

    this.scene.add.existing(cloud);
    this.clouds.push(cloudName);
  }

  private distanceBetweenCloudAndPlayer(playerX: number, playerY: number, cloudX: number, cloudY: number): number {
    return Math.sqrt(Math.pow(playerX - cloudX, 2) + Math.pow(playerY - cloudY, 2));
  }

}