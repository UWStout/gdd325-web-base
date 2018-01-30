// Import the two main libraries that Phaser will depend on (only done once)
import 'pixi' // The underlying sprite library of Phaser
import 'p2' // The most flexible physics library used in Phaser

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the three main states used in our example game
import BootState from './states/Boot' // A preliminary state that loads minimal assets
import SplashState from './states/Splash' // A fancy loading splash screen for loading more assets
import TestLevelState from './states/TestLevel' // The main game level for testing

// Import our general configuration file
import config from './config'

/**
 * The main class that encapsulates the entirity of our game including all the game states,
 * all the loaded and cached assets, and any reusable logic needed in any state.
 * NOTE: See the parent class, Phaser.Game, for more details.
 */
class Game extends Phaser.Game {
  // Function automatically called upon class creation
  constructor () {
    // Pass configuration details to Phaser.Game
    super(config.gameWidth, config.gameHeight, Phaser.AUTO, 'content', null)

    // Name and load ALL needed game states (add more states here as you make them)
    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('TestLevel', TestLevelState, false)

    // Start the 'boot' state
    // Note: during development it may be helpful to skip this and load right into the
    //       first level just to save having to watch the splash screen every time.
    this.state.start('Boot')
  }
}

// This code executes once every time the containing webpage (index.html) is loaded.
// It creates a single instace of the Game class (defined above) and attaches it to
// the global object 'window.'  It also causes Game's constructor to run, kicking
// off the logic of the ENTIRE game.
window.game = new Game()
