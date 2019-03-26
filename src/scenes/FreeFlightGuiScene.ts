import { GameData } from '../core/GameData';
import { GuiAltimeter } from '../components/gui/GuiAltimeter';
import { GuiFuel } from '../components/gui/GuiFuel';
import { GuiSpeedometer } from '../components/gui/GuiSpeedometer';
import { GuiBooster } from '../components/gui/GuiBooster';
import { GuiClock } from '../components/gui/GuiClock';

export class FreeFlightGuiScene extends Phaser.Scene {

  // ** Fields **
  private altimeter!:GuiAltimeter;
  private fuel!:GuiFuel;
  private speed!:GuiSpeedometer;
  private booster!:GuiBooster;
  private clock!:GuiClock;

  // ** Constructor **
  constructor(){
    super({ key: 'FreeFlightGuiScene',active:true });
  }

  // ** Load, Create, Configure **
  public preload(){
    // load images used by ui
    this.configureSceneImages();
  }

  create(){

    this.speed = new GuiSpeedometer(this,window.innerWidth-150,window.innerHeight-160);
    this.altimeter = new GuiAltimeter(this,0,0);
    this.fuel = new GuiFuel(this,window.innerWidth-70,window.innerHeight-230);
    this.booster = new GuiBooster(this,window.innerWidth-230,window.innerHeight-230);
    this.clock = new GuiClock(this,100,60);
  }

  private configureSceneImages(){
    this.load.image(GameData.Gui.AtmosphereBody.ImageName,
      GameData.Gui.AtmosphereBody.ImagePath);
    this.load.image(GameData.Gui.AtmosphereNedle.ImageName,
      GameData.Gui.AtmosphereNedle.ImagePath);
    this.load.image(GameData.Gui.AltimeterBody.ImageName,
      GameData.Gui.AltimeterBody.ImagePath);
    this.load.image(GameData.Gui.SpeedometerBody.ImageName,
      GameData.Gui.SpeedometerBody.ImagePath);
    this.load.image(GameData.Gui.SpeedometerSpeedNeedle.ImageName,
      GameData.Gui.SpeedometerSpeedNeedle.ImagePath);
    this.load.image(GameData.Gui.SpeedometerVerticalSpeedNeedle.ImageName,
      GameData.Gui.SpeedometerVerticalSpeedNeedle.ImagePath);
    this.load.image(GameData.Gui.FuelBody.ImageName,
        GameData.Gui.FuelBody.ImagePath);
    this.load.image(GameData.Gui.BoosterBody.ImageName,
      GameData.Gui.BoosterBody.ImagePath);
    this.load.image(GameData.Gui.BoosterNeedle.ImageName,
      GameData.Gui.BoosterNeedle.ImagePath);
    this.load.image(GameData.Gui.BoosterTemperatureNeedle.ImageName,
      GameData.Gui.BoosterTemperatureNeedle.ImagePath);
    this.load.image(GameData.Gui.ClockBody.ImageName,
      GameData.Gui.ClockBody.ImagePath);
  }

  // ** Controller **
  public setAltimeter(altitude:number){
    if( this.altimeter !== undefined ){
      this.altimeter.setAltitude(altitude);
    }
  }

  public setFuel(currentFuel:number,maxFuel:number){
    if( this.fuel !== undefined){
      this.fuel.setFuel(currentFuel,maxFuel);
    }
  }

  public setBoosterFuel(currentFuel:number,maxFuel:number){
    if( this.booster !== undefined ){
      this.booster.setBooster(currentFuel,maxFuel);
    }
  }

  public setBoosterHeatTemperature(temperature:number,maxTemperature:number){
    if( this.booster !== undefined ){
      this.booster.setBoosterTemperature(temperature,maxTemperature);
    }
  }

  public setSpeed(speed:number){
    if( this.speed !== undefined ){
      this.speed.setSpeed(speed);
    }
  }

  public setVerticalSpeed(verticalSpeed:number){
    if( this.speed !== undefined ){
      this.speed.setVerticalSpeed(verticalSpeed);
    }
  }

  public setClock(time:number){
    if( this.clock !== undefined ){
      this.clock.setTime(time);
    }
  }

  public setMoney(amount:number){
    if( this.clock !== undefined ){
      this.clock.setMoney(amount);
    }
  }

}

