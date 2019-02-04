/* global __NWJS__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

import { centerX, centerY } from '../utils'

class Boot extends Phaser.Scene {
  // Initialize the stage and any simple settings
  init () {
    // Set the background color
    this.cameras.main.backgroundColor = '#7f7f7f'

    // If running as a packaged app, go to full screen right away
    if (__NWJS__) {
      let canvas = this.sys.game.canvas
      let fullscreen = this.sys.game.device.fullscreen
      if (fullscreen.available) {
        canvas[fullscreen.request]()
      }
    }
  }

  // Load all data needed for this game state
  preload () {
    // Show message that fonts are loading
    let text = this.add.text(centerX(this), centerY(this),
      'loading', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.setOrigin(0.5, 0.5)

    // Read the assets for the splash screen (used in next stage)
    this.load.image('logo', './assets/images/icon.png')
  }

  // Called repeatedly after pre-load to draw the stage
  update () {
    this.scene.start('Splash')
  }
}

// Expose the Boot class for use in other modules
export default Boot
