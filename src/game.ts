import { FreeFlightScene } from './scenes/FreeFlightScene';
import { FreeFlightGuiScene } from './scenes/FreeFlightGuiScene';

const config: GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor:'#fff',
  scene: [FreeFlightScene,FreeFlightGuiScene],
};

const game = new Phaser.Game(config);