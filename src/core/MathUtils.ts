import { Constants } from '../core/Constants'

export class MathUtils {

  // *** Convert world units to feet ***
  static AltitudeToFeet(altitude: number): number {
    return altitude / Constants.UnitsPerFeet;
  }

  // *** Map function from Arduino to clamp and adjust values ***
  static Map(inValue: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (inValue - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  // *** Receive milliseconds and return hh:mm format ***
  static MillisecondsToTime(timeInMilliseconds: number): string {

    var SS:string = (Math.floor((timeInMilliseconds / 1000) % 60)).toString();
    var MM:string = (Math.floor((timeInMilliseconds / (1000 * 60)) % 60).toString());

    SS = SS.length == 1 ? '0'+SS:SS;
    MM = MM.length == 1 ? '0'+MM:MM;

    return MM+':'+SS;
  }

  // *** Format number to currency ***
  static CurrencyFromNumber(amount:number):string{
    return "$"+ amount.toFixed(0);
  }

}