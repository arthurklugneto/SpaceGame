import { Player } from '../components/game/Player'
import { Constants } from '../core/Constants';
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
  private cloudGenerationStep:number = 10;
  private cloudGenerationProbability:number = 0.82;

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

    console.log(this.clouds.length);

    //remove clouds outside de bounds
    for (var i = 0; i < this.clouds.length; i++) {
      var cloud = this.scene.children.getByName(this.clouds[i]) as Phaser.GameObjects.Sprite;
      if (cloud != null) {
        if (this.isCloudOutsideBounds(cloud, player)) {
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
        if( this.noise.noise2D(w/this.cloudGenerationStep,h/this.cloudGenerationStep) > this.cloudGenerationProbability ){
          var cloudName = 'Cloud.Low.#' + Md5.hashStr(Date.now());
          var cloudIndex = Math.floor(Math.random()*this.lowAltitudeCloudSprite.length);

          var cloud = new Phaser.GameObjects.Sprite(
            this.scene,
            w,h,
            this.lowAltitudeCloudSprite[cloudIndex]);

          cloud.setName(cloudName);

          this.scene.add.existing(cloud);
          this.clouds.push(cloudName);
        }
      }
    }

    this.initialPositionedClouds = true;

  }

  private isCloudOutsideBounds(cloud: Phaser.GameObjects.Sprite, player: Player): boolean {
    console.log(cloud.name+">"+cloud.x);
    return cloud.x < (player.x-(this.HalfWidth+this.MarginWidth));
    //console.log(cloud.name+">"+cloud.x);
    //return cloud.x > (player.x+(this.HalfWidth+this.MarginWidth));
  }

  private removeCloud(cloud: string) {
    var index = this.clouds.indexOf(cloud);
    if (index !== -1) {
      this.clouds.splice(index, 1);
    }
  }

  private createCloud(player: Player, oldCloud: Phaser.GameObjects.Sprite, time: number) {
    // generate random position for new cloud
    var cloudX = player.x;
    var cloudY = player.y;
    var cloudName = 'Cloud.Low.#' + Md5.hashStr(time.toString());

    // select a random low altitude cloud
    var cloudIndex = Math.floor(Math.random() * this.lowAltitudeCloudSprite.length);

    // create the new cloud
    var cloud = new Phaser.GameObjects.Sprite(
      this.scene,
      cloudX, cloudY,
      this.lowAltitudeCloudSprite[cloudIndex]);

    // set a random alpha value
    // for this cloud and its name
    cloud.setAlpha(Math.random());
    cloud.setScale(Math.random() * 2);
    cloud.setName(cloudName);

    // adds the new cloud
    this.scene.add.existing(cloud);
    this.clouds.push(cloudName);
  }

  private distanceBetweenCloudAndPlayer(playerX: number, playerY: number, cloudX: number, cloudY: number): number {
    return Math.sqrt(Math.pow(playerX - cloudX, 2) + Math.pow(playerY - cloudY, 2));
  }

}


    /*
    var simplex = new OpenSimplexNoise(Date.now());
    console.log( simplex.noise2D(1,0) );

    this.clouds = [];
    for (var i = 0; i < 1000; i++) {
      var randX = Math.random() * 10000 - 5000;
      var randY = Math.random() * 10000 - 5000 + 10000;
      this.clouds.push(this.scene.add.sprite(-randX, -randY, GameData.Sky.Cloud1.ImageName));
    }

    // Para objeto
Object.assign( this.newObject, objReferencia );
this.newObject = Object.create(objReferencia);
// Para lista
this.listaObjetos = Array.from( this.oldListaObjetos );


// Para objeto
    this.newObject = {...objReferencia};
    // Para lista
    this.listaObjetos = [...this.oldListaObjetos];

    /*
    if( Math.round(time/1000) != this.lastTime ){
      this.lastTime = Math.round(time/1000);
      var randomNumber = Math.floor(Math.random()*this.lowAltitudeCloudSprite.length);
      this.clouds.push( scene.add.sprite(player.x,player.y,this.lowAltitudeCloudSprite[randomNumber]) );
    }
    */
