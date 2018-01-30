// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import { centerGameObjects } from '../utils'
import config from '../config'

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading. It should ensure it is always
 * displayed some mimimum amount of time (in case the assets are already cached
 * locally) and it should have pre-loaded any assets it needs to display in Boot
 * before it is run. Generally only runs once, after Boot, and cannot be re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Splash extends Phaser.State {
  // Initialize some local settings for this state
  init () {
    // When was this state started?
    this.started = this.game.time.time

    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)

    // Add the logo to the screen and center it
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo')
    centerGameObjects([this.logo])
  }

  preload () {
    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)

    // Load all the assets needed for next state

    // The main player spritesheet
    this.load.spritesheet('player-main', 'assets/images/player-main.png', 64, 64)

    // The audiosprite with all music and SFX
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

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    // Check how much time has elapsed since the stage started
    if (this.game.time.elapsedSecondsSince(this.started) >= config.MIN_SPLASH_SECONDS) {
      // Switch to 'game' state once MIN_SPLASH_SECONDS or more has elapsed
      this.state.start('Game')
    }
  }
}

// Expose the Splash class for use in other modules
export default Splash
