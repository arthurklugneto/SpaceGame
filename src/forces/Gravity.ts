import { Force } from '../core/Force';
import { Constants } from '../core/Constants'

export class Gravity extends Force {

  // *** Constructor ***
  constructor() {
    super(0, 0.05);
  }

}