import { GameData } from "../../core/GameData";
import { MathUtils } from "../../core/MathUtils";

export class GuiAltimeter extends Phaser.GameObjects.Container{

  // *** Fields ***
  private text!:Phaser.GameObjects.Text;
  private atmosphereBody!: Phaser.GameObjects.Sprite;
  private atmosphereNedle!: Phaser.GameObjects.Sprite;
  private altimeterBody!:Phaser.GameObjects.Sprite;

  private altitude:number = 0;
  private maxAtmosphereAltitude = 42000;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number)
  {
    super(_scene, _x, _y);

    this.altimeterBody =  this.scene.add.sprite(
      window.innerWidth-180,
      window.innerHeight-70,
      GameData.Gui.AltimeterBody.ImageName);

    this.atmosphereBody = this.scene.add.sprite(
      window.innerWidth-70,
      window.innerHeight-70,
      GameData.Gui.AtmosphereBody.ImageName);
    this.atmosphereBody.setScale(0.5);

    this.atmosphereNedle =  this.scene.add.sprite(
      window.innerWidth-70,
      window.innerHeight-70,
      GameData.Gui.AtmosphereNedle.ImageName);
    this.atmosphereNedle.setScale(0.5);

    var text = _scene.add.text(window.innerWidth-296,
      window.innerHeight-86,
      '0',
    { color: '#d8d8d8', align: 'right'});
    text.setFontSize(30);
    text.setFontFamily('Arial Black');
    this.text=text;
  }

  // *** Controller ***
  setAltitude(value:number)
  {
    this.altitude = value;

    this.updateAtmosphereNeedle();
    this.text.setText(value.toFixed(0));
  }

  // *** Update ***
  private updateAtmosphereNeedle(){
    var needle = MathUtils.Map(this.altitude,0,this.maxAtmosphereAltitude,-2.6,2.6);
    if( needle < -2.6 ) needle = -2.6;
    if( needle > 2.6 ) needle = 2.6
    this.atmosphereNedle.rotation = needle;
  }

}