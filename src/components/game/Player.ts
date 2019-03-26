import { MathUtils } from '../../core/MathUtils';
import { Constants } from '../../core/Constants';
import { GameData } from '../../core/GameData';
import { Force } from '../../core/Force';

export class Player extends Phaser.GameObjects.Container {

  // *** Images / Sprites ***
  private headSprite!: Phaser.GameObjects.Sprite;
  private engineSprite!: Phaser.GameObjects.Sprite;
  private bodySprite!: Phaser.GameObjects.Sprite;
  private finsSprite!: Phaser.GameObjects.Sprite;
  private boosterSprite!: Phaser.GameObjects.Sprite;
  // *** General Parameters ***
  private keys!: any;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  private isMainEngineOn: boolean = true;
  private isBoosterOn: boolean = false;
  private isBoosterOverheated: boolean = false;
  // *** Player Parameters ***
  private acceleration: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private drag: Force = new Force(0, 0);

  private altitude: number;
  private speed: number;
  private verticalSpeed: number;
  private airDensity: number;
  private dryWeight: number;
  private maxWeight: number;
  private flightTime: number;
  private flightMoney: number;
  private flightMoneyRate: number;
  private totalMoney: number;

  private hp: number;
  private armor: number;
  private weight: number;
  private power: number;
  private maxFuel: number;
  private fuel: number;
  private fuelConsumption: number;
  private boosterPower: number;
  private maxBoosterFuel: number;
  private boosterFuel: number;
  private boosterFuelConsumption: number;
  private boosterOverheating: number;
  private boosterOverheatingRate: number;
  private boosterMaxTemperature: number;
  private handling: number;
  private airResistance: number;

  // *** Constructor ***
  constructor(_scene: Phaser.Scene, _x: number, _y: number) {
    super(_scene, _x, _y);

    // load the player sprites and add to scene
    this.loadPlayerSprites();

    // update initial altitude
    this.updateAltitude();

    // TODO: This should come from Outside

    this.altitude = 0;                  // altitude in generic units
    this.speed = 0;                     // distance in units between last and current position
    this.verticalSpeed = 0;             // distance of y axis in units between last and current position
    this.flightTime = 0;                // time passed in ms sice flight start
    this.flightMoney = 0;               // money obtained in flight since start
    this.flightMoneyRate = 0.025;       // money won by tick
    this.totalMoney = 0;                // total player money as an sum from all flights
    this.handling = 0.02;              // angular velocity by tick in radians
    this.hp = 200;                      // total HP to resist against shock or fall
    this.armor = 1;                     // armor factor to be used when shock or fall occours
    this.power = 0.19;                  // engine raw power

    // 4. Drag is calculated to restrict velocity using formula
    // Drag = 0.5 * airDensity * velocity² * airResistance
    this.airDensity = 1;
    this.airResistance = 1;

    // 3. fuel is decreased if engine is on maxfuel is the
    // initial fuel an is used to Map between maxFuel and 0
    // against fuel to determine the weight.
    this.fuel = 1000;
    this.maxFuel = this.fuel;
    this.fuelConsumption = 0.5;

    // 2. An aditional force is applied to thrust based on
    // value if boosterPower meanin 1 = 100%, 0.3 = 30%...
    // when booster is on boosterOverheating is added by
    // boosterOverheatingRate that is automatically lowered
    // when booster is deactivated. If boosterOverheating ==
    // boosterMaxTemperature booster if overheated.
    this.boosterPower = 0.3;
    this.boosterFuel = 30;
    this.maxBoosterFuel = this.boosterFuel;
    this.boosterFuelConsumption = 0.1;
    this.boosterOverheating = 0;
    this.boosterMaxTemperature = 20;
    this.boosterOverheatingRate = 0.2;

    // 1.actual Engine Power is Map with values of dryWeight
    // and maxWeight over weight (which is decreased in flight)
    // to determine engine power to be from 100% to 200%
    this.weight = 10000;
    this.dryWeight = this.weight * 0.1;
    this.maxWeight = this.weight;

    // configure images for debug mode
    if (Constants.DebugMode) {
      this.setAlpha(0.5);
      this.debugGraphics = _scene.add.graphics();
    }

  }

  // *** Load, Create, Configure ***
  private loadPlayerSprites() {
    this.headSprite = this.scene
      .add
      .sprite(GameData.Parts.Head.Stock.ImageOffsetX,
        GameData.Parts.Head.Stock.ImageOffsetY,
        GameData.Parts.Head.Stock.ImageName);

    this.bodySprite = this.scene
      .add
      .sprite(GameData.Parts.Body.Stock.ImageOffsetX,
        GameData.Parts.Body.Stock.ImageOffsetY,
        GameData.Parts.Body.Stock.ImageName);

    this.engineSprite = this.scene
      .add
      .sprite(GameData.Parts.Engine.Stock.ImageOffsetX,
        GameData.Parts.Engine.Stock.ImageOffsetY,
        GameData.Parts.Engine.Stock.ImageName);

    this.finsSprite = this.scene
      .add
      .sprite(GameData.Parts.Fins.Stock.ImageOffsetX,
        GameData.Parts.Fins.Stock.ImageOffsetY,
        GameData.Parts.Fins.Stock.ImageName);

    this.boosterSprite = this.scene
      .add
      .sprite(GameData.Parts.Booster.Stock.ImageOffsetX,
        GameData.Parts.Booster.Stock.ImageOffsetY,
        GameData.Parts.Booster.Stock.ImageName);

    this.add([this.boosterSprite,
    this.headSprite,
    this.engineSprite,
    this.bodySprite,
    this.finsSprite]);
  }

  // *** Update ***
  public update(time: number, delta: number) {

    this.updateThrust();
    this.updateBoosterThrust();
    this.updateDrag();
    this.updatePositionAndSpeed();
    this.updateFuelConsumptionAndWeight();
    this.updateAltitude();
    this.updateTimeAndMoney(delta);

  }

  private updateThrust() {
    if (this.isMainEngineOn) {
      if (this.fuel > 0) {
        var thrustForce: Force = new Force(Math.sin(this.rotation), -Math.cos(this.rotation));
        thrustForce.mul(this.updateEnginePower());
        this.applyForce(thrustForce.outMul(this.weight));
      }
    }
  }

  private updateEnginePower(): number {
    return MathUtils.Map(this.weight, this.maxWeight, this.dryWeight, this.power, this.power * 2);
  }

  private updateBoosterThrust() {
    if (this.isBoosterOn) {
      if (this.boosterFuel > 0 && !this.isBoosterOverheated) {
        var thrustForce: Force = new Force(Math.sin(this.rotation), -Math.cos(this.rotation));
        thrustForce.mul(this.boosterPower);
        this.updateBoosterTemperature();
        this.applyForce(thrustForce.outMul(this.weight));
      }
    } else {
      this.updateBoosterTemperature();
    }
  }

  private updateBoosterTemperature() {
    if (this.isBoosterOn) {
      this.boosterOverheating += this.boosterOverheatingRate;
    } else {
      if (this.boosterOverheating > 0) {
        this.boosterOverheating -= this.boosterOverheatingRate;

      }
      if (this.boosterOverheating < 0) {
        this.boosterOverheating = 0;
      }
    }

    if (this.boosterOverheating == this.boosterMaxTemperature) {
      this.isBoosterOverheated = true;
    }

    if (this.boosterOverheating == 0) {
      this.isBoosterOverheated = false;
    }

  }

  private updateDrag() {
    var dragForce: Force = new Force(this.velocity.x * -1, this.velocity.y * -1);
    dragForce.mul(0.5);
    dragForce.mul(this.airDensity);
    dragForce.mul(this.speed * this.speed);
    dragForce.mul(this.airResistance);
    this.drag = dragForce;

    this.applyForce(this.drag);
  }

  private updateAltitude() {
    this.altitude = this.y * -1;
  }

  private updateFuelConsumptionAndWeight() {

    if (this.isMainEngineOn) {
      this.fuel -= this.fuelConsumption;
    }

    if (this.isBoosterOn) {
      this.boosterFuel -= this.boosterFuelConsumption;
    }

    if (this.fuel < 0) this.fuel = 0;
    if (this.boosterFuel < 0) this.boosterFuel = 0;

    this.weight = MathUtils.Map(this.fuel, 0, this.maxFuel, this.dryWeight, this.maxWeight);
  }

  private updatePositionAndSpeed() {

    var lastPosition = new Phaser.Math.Vector2(this.x, this.y);

    this.velocity.add(this.acceleration);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.acceleration.scale(0);

    var currentPosition = new Phaser.Math.Vector2(this.x, this.y);
    this.speed = lastPosition.distance(currentPosition);
    this.verticalSpeed = lastPosition.y - currentPosition.y;

  }

  private updateTimeAndMoney(delta: number) {
    this.flightTime += delta;
    this.flightMoney += this.flightMoneyRate;
  }

  public updateKeyInput(keys: any) {

    this.keys = keys;

    this.isBoosterOn = this.keys.W.isDown;
    this.isMainEngineOn = !this.keys.S.isDown;
    if (this.keys.A.isDown) this.rotation -= this.handling;
    if (this.keys.D.isDown) this.rotation += this.handling;

  }

  // *** Methods ***
  public applyForce(force: Force) {
    let normalizedForce: Force = force.outDiv(this.weight);
    this.acceleration.add(normalizedForce);
  }

  public debugObject() {
    if (Constants.DebugMode) {
      var bound = this.getBounds();
      this.debugGraphics.clear();

      // bound box
      this.debugGraphics.lineStyle(1, 0xff0000);
      this.debugGraphics.strokeRectShape(bound);
      // velocity
      this.debugGraphics.lineStyle(2, 0x00ff00);
      this.debugGraphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y, this.x + this.velocity.x * 4, this.y + this.velocity.y * 4));
      // drag
      this.debugGraphics.lineStyle(2, 0x0000ff);
      this.debugGraphics.strokeLineShape(new Phaser.Geom.Line(this.x, this.y, this.x + this.drag.x * 4, this.y + this.drag.y * 4));
    }
  }

  // *** Getters & Setters ***
  public get Hp(): number {
    return this.hp;
  }
  public set Hp(value: number) {
    this.hp = value;
  }
  public get Armor(): number {
    return this.armor;
  }
  public set Armor(value: number) {
    this.armor = value;
  }
  public get Weight(): number {
    return this.weight;
  }
  public set Weight(value: number) {
    this.weight = value;
  }
  public get Power(): number {
    return this.power;
  }
  public set Power(value: number) {
    this.power = value;
  }
  public get Fuel(): number {
    return this.fuel;
  }
  public set Fuel(value: number) {
    this.fuel = value;
  }
  public get MaxFuel(): number {
    return this.maxFuel;
  }
  public set MaxFuel(value: number) {
    this.maxFuel = value;
  }
  public get FuelConsumption(): number {
    return this.fuelConsumption;
  }
  public set FuelConsumption(value: number) {
    this.fuelConsumption = value;
  }
  public get BoosterPower(): number {
    return this.boosterPower;
  }
  public set BoosterPower(value: number) {
    this.boosterPower = value;
  }
  public get BoosterFuel(): number {
    return this.boosterFuel;
  }
  public set BoosterFuel(value: number) {
    this.boosterFuel = value;
  }
  public get MaxBoosterFuel(): number {
    return this.maxBoosterFuel;
  }
  public set MaxBoosterFuel(value: number) {
    this.maxBoosterFuel = value;
  }
  public get BoosterFuelConsumption(): number {
    return this.boosterFuelConsumption;
  }
  public set BoosterFuelConsumption(value: number) {
    this.boosterFuelConsumption = value;
  }
  public get BoosterOverheating(): number {
    return this.boosterOverheating;
  }
  public set BoosterOverheating(value: number) {
    this.boosterOverheating = value;
  }
  public get BoosterMaxOverheating(): number {
    return this.boosterMaxTemperature;
  }
  public set BoosterMaxOverheating(value: number) {
    this.boosterMaxTemperature = value;
  }
  public get Handling(): number {
    return this.handling;
  }
  public set Handling(value: number) {
    this.handling = value;
  }
  public get AirResistance(): number {
    return this.airResistance;
  }
  public set AirResistance(value: number) {
    this.airResistance = value;
  }
  public get Altitude(): number {
    return this.altitude;
  }
  public get Speed(): number {
    return this.speed;
  }
  public get VerticalSpeed(): number {
    return this.verticalSpeed;
  }
  public get FlightTime(): number {
    return this.flightTime;
  }
  public set FlightTime(time: number) {
    this.flightTime = time;
  }
  public get Money(): number {
    return this.totalMoney
  }
  public set Money(amount: number) {
    this.totalMoney = amount
  }
  public get FlightMoney(): number {
    return this.flightMoney;
  }
  public set FlightMoney(amount: number) {
    this.flightMoney = amount
  }


}