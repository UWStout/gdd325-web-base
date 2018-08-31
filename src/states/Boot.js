// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// A flexible tool for loading fonts from many common sources
// including typekit, google fonts, fonts.com and fontdeck.
// See more here: https://www.npmjs.com/package/webfontloader
import WebFont from 'webfontloader'

// Grab some global configuration options for local use
import config from '../config'

/**
 * The Boot game state. This game state is used as a quick, low-impact
 * game state that will pre-load any assets needed for a more feature-
 * rich loading screen or splash screen that will come next. You should
 * load ONLY the bare minimum assets needed to enable the state that
 * comes next to do its job: typically a loading bar, music, logo and
 * any fonts used for display. Generally happens only once, cannot be
 * re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Boot extends Phaser.State {
  // Initialize the stage and any simple settings
  init () {
    // Set the background color
    this.stage.backgroundColor = '#7f7f7f'

    // Initialize the fontsReady property
    this.fontsReady = false

    // Bind the fontsLoaded method to this object instance
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  // Load all data needed for this game state
  preload () {
    // Load needed font (will load asynchronously)
    // Calls fontsLoaded() when complete
    if (config.webfonts && config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    // Show message that fonts are loading
    let text = this.add.text(this.world.centerX, this.world.centerY,
      'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    // Read the assets for the splash screen (used in next stage)
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    this.load.image('logo', './assets/images/blaze.jpg')
  }

  // Called repeatedly after pre-load to draw the stage
  render () {
    // Wait for font before proceeding
    if (config.webfonts.length > 0 && this.fontsReady) {
      this.state.start('Splash')
    }

    // No fonts need to load so just get to it
    if (!config.webfonts || config.webfonts.length == 0) {
      this.state.start('Splash')
    }
  }

  // Signal that the font has finished loading
  fontsLoaded () {
    this.fontsReady = true
  }
}

// Expose the Boot class for use in other modules
export default Boot
