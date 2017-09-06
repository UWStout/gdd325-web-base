import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.started = this.game.time.time
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo')
    centerGameObjects([this.logo])
  }

  preload () {
    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)

    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)

    // Load all the assets needed for next level
    this.load.spritesheet('player-main', 'assets/images/player-main.png', 64, 64)
    this.load.audioSprite('sounds', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ], 'assets/audio/sounds.json')
  }

  // Pre-load is done
  create () {
    // Destroy progress bar assets
    this.loaderBar.destroy()
    this.loaderBg.destroy()
  }

  update () {
    if (this.game.time.elapsedSecondsSince(this.started) >= config.MIN_SPLASH_SECONDS) {
      // Switch to 'game' state
      this.state.start('Game')
    }
  }
}
