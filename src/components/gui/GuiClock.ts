import { MathUtils } from "../../core/MathUtils";
import { GameData } from "../../core/GameData";

export class GuiClock extends Phaser.GameObjects.Container{

  // *** Fields ***
  private clockText!:Phaser.GameObjects.Text;
  private clockImage!:Phaser.GameObjects.Sprite;
  private moneyText!:Phaser.GameObjects.Text;

  private elapsedTime:number = 0;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number){

    super(_scene, _x, _y);

    this.clockImage = this.scene.add.sprite(
      _x,_y,GameData.Gui.ClockBody.ImageName);

    this.clockText = _scene.add.text(_x-32,_y-30,'00:00');
    this.clockText.setFontSize(32);
    this.clockText.setColor("#303030");
    this.clockText.setFontFamily('Arial Black');

    this.moneyText = _scene.add.text(_x-32,_y+8,'$0.00');
    this.moneyText.setFontSize(24);
    this.moneyText.setColor("#d8d8d8");
    this.moneyText.setFontFamily('Arial Black');

  }

  // *** Controller ***
  public setTime(timeInMilliseconds:number){
    this.elapsedTime = timeInMilliseconds;
    this.clockText.setText(MathUtils.MillisecondsToTime(timeInMilliseconds));
  }

  public setMoney(moneyValue:number){
    this.moneyText.setText(MathUtils.CurrencyFromNumber(moneyValue));
  }

}