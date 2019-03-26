import 'phaser';
import { GameData } from '../core/GameData';
import { Constants } from '../core/Constants';
import { Player } from '../components/game/Player';
import { FlatGround } from '../components/game/FlatGround';
import { Gravity } from '../forces/Gravity';
import { MathUtils } from '../core/MathUtils';
import { FreeFlightGuiScene } from '../scenes/FreeFlightGuiScene';
import { Sky } from '../components/game/Sky';
import { CloudPositioner } from '../core/CloudPositioner';

export class FreeFlightScene extends Phaser.Scene {

  // ** Fields **
  private gui!: FreeFlightGuiScene;
  private player!: Player;
  private ground!: FlatGround;
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private gravity!: Gravity;
  private keys!: any;
  private sky!: Sky;

  // ** Constructor **
  constructor() {
    super({ key: 'FreeFlightScene' });
  }

  // ** Load, Create, Config **
  public preload() {
    // load the images to the scene like parts, enemies, etc...
    this.configureSceneImages();
  }

  public create() {

    // create sky
    this.sky = new Sky(this, 0, 0, new CloudPositioner(this,0,0));

    // create scene objects
    this.createPlayer();
    this.createGround();
    this.configureCamera();
    this.configureKeyInputs();

    // create scene forces
    this.createForces();

    // creates reference to gui scene
    this.gui = this.scene.get('FreeFlightGuiScene') as FreeFlightGuiScene;

  }

  private createPlayer() {
    // creates and add the player
    this.player = new Player(this, 0, 0);
    this.add.existing(this.player);
  }

  private createGround() {
    // creates and add the flat ground
    this.ground = new FlatGround(this, 0, 4900);
    this.add.existing(this.ground);
  }

  private createForces() {
    // creates gravity
    this.gravity = new Gravity();
  }

  private configureCamera() {
    // configure the camera
    this.camera = this.cameras.main;
    this.camera.zoom = 1;
    this.camera.scrollX = -400;
    this.camera.scrollY = -300;
    this.camera.startFollow(this.player);
  }

  private configureKeyInputs() {
    // configure keys to be used as input
    this.keys = this.input.keyboard.addKeys('W,A,S,D');
  }

  private configureSceneImages() {

    //GROUND
    this.load.image(GameData.Ground.Flat.ImageName,
      GameData.Ground.Flat.ImagePath);

    // SKY & CLOUDS
    this.load.image(GameData.Sky.Default.ImageName,
      GameData.Sky.Default.ImagePath);
    this.load.image(GameData.Sky.CloudLow1.ImageName,
      GameData.Sky.CloudLow1.ImagePath);
    this.load.image(GameData.Sky.CloudLow2.ImageName,
      GameData.Sky.CloudLow2.ImagePath);
    this.load.image(GameData.Sky.CloudLow3.ImageName,
      GameData.Sky.CloudLow3.ImagePath);
    this.load.image(GameData.Sky.CloudLow4.ImageName,
      GameData.Sky.CloudLow4.ImagePath);
    this.load.image(GameData.Sky.CloudLow5.ImageName,
      GameData.Sky.CloudLow5.ImagePath);

    //==========================
    // Rocket Parts
    //==========================

    // Head
    this.load.image(GameData.Parts.Head.Stock.ImageName,
      GameData.Parts.Head.Stock.ImagePath);
    // Body
    this.load.image(GameData.Parts.Body.Stock.ImageName,
      GameData.Parts.Body.Stock.ImagePath);
    // Engine
    this.load.image(GameData.Parts.Engine.Stock.ImageName,
      GameData.Parts.Engine.Stock.ImagePath);
    // Fins
    this.load.image(GameData.Parts.Fins.Stock.ImageName,
      GameData.Parts.Fins.Stock.ImagePath);
    // Booster
    this.load.image(GameData.Parts.Booster.Stock.ImageName,
      GameData.Parts.Booster.Stock.ImagePath);
  }

  // ** Update **
  update(time: number, delta: number) {

    // update user input to player
    this.player.updateKeyInput(this.keys);

    // update the player
    this.player.applyForce(this.gravity.outMul(this.player.Weight));
    this.player.update(time, delta);

    // update the sky
    this.sky.update(this.player,time);

    // update camera
    var zoom = MathUtils.Map(this.player.Speed, 0, 50, 1, 0.5);
    if (zoom < 0.5) zoom = 0.5;
    if (zoom > 1) zoom = 1;
    this.camera.zoom = zoom;

    // update the gui
    this.gui.setAltimeter(MathUtils.AltitudeToFeet(this.player.Altitude));
    this.gui.setSpeed(MathUtils.AltitudeToFeet(this.player.Speed));
    this.gui.setVerticalSpeed(MathUtils.AltitudeToFeet(this.player.VerticalSpeed));
    this.gui.setBoosterFuel(this.player.BoosterFuel, this.player.MaxBoosterFuel);
    this.gui.setBoosterHeatTemperature(this.player.BoosterOverheating, this.player.BoosterMaxOverheating);
    this.gui.setFuel(this.player.Fuel, this.player.MaxFuel);
    this.gui.setClock(this.player.FlightTime);
    this.gui.setMoney(this.player.FlightMoney);

    // debug player if needed
    this.player.debugObject();

  }

}