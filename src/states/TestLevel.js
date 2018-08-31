/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the main player sprite
import MainPlayer from '../sprites/Player'

// Import config settings
import config from '../config'

/**
 * The TestLevel game state. This game state is a simple test level showing a main
 * player sprite that can be roughly controlled with the left, right, and shift keys.
 * It also displays some text, shows how to display debugging info properly, and
 * sequences and plays some background music and sound FX. Level can usually occur
 * more than once during a play session so assume this state CAN be re-entered. All
 * assets are pre-loaded and cached in the Splash state so this must have run once
 * before loading this state.
 *
 * See Phaser.State for more about game states.
 */
class TestLevel extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preload () {}

  create () {
    // Create and add the main player object
    this.player = new MainPlayer({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    // Compute a reasonable height for the floor based on the height of the player sprite
    let floorHeight = this.player.bottom

    // Create the "floor" as a manually drawn rectangle
    this.floor = this.game.add.graphics(0, 0)
    this.floor.beginFill(0xabb8c2)
    this.floor.drawRect(0, floorHeight, this.game.world.width, this.game.world.height / 2)
    this.floor.endFill()

    // Add player after the floor
    this.game.add.existing(this.player)

    // Setup all the text displayed on screen
    this.setupText(floorHeight)

    // Start playing the background music
    this.game.sounds.play('music-intro', config.MUSIC_VOLUME)

    // Setup the key objects
    this.setupKeyboard()
  }

  setupText (floorHeight) {
    // Title message to show on screen
    const bannerText = 'UW Stout / GDD 325 - 2D Web Game Base'
    let banner = this.add.text(this.world.centerX, 180, bannerText)

    // Configure all the title message font properties
    banner.font = 'Libre Franklin'
    banner.padding.set(10, 16)
    banner.fontSize = 30
    banner.fontWeight = 'bolder'
    banner.stroke = '#FFFFFF'
    banner.strokeThickness = 1
    banner.fill = '#012169'
    banner.anchor.setTo(0.5)

    // Control message to show on screen
    const controlText = 'L & R arrow -- walk\n' +
                        '      SHIFT -- hold to run'
    let controls = this.add.text(this.game.width - 100, floorHeight + 60, controlText)

    // Configure all the control message font properties
    controls.font = 'Courier'
    controls.padding.set(10, 0)
    controls.fontSize = 18
    controls.fill = '#000000'
    controls.anchor.setTo(1.0, 0)

    // Credits message to show on screen
    const creditsText = 'Based on "The Great Tsunami Theif":\n' +
                        '     Colton Barto -- Programming\n' +
                        ' Nicole Fairchild -- Art\n' +
                        '   Maria Kastello -- Programming\n' +
                        '     Austin Lewer -- Art\n' +
                        '    Austin Martin -- Music\n' +
                        '    Cole Robinson -- Programming\n' +
                        '       Shane Yach -- Programming'

    // Configure all the credits message font properties
    let credits = this.add.text(100, floorHeight + 20, creditsText)
    credits.font = 'Courier'
    credits.padding.set(10, 0)
    credits.fontSize = 14
    credits.fill = '#000000'
    credits.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)
    credits.anchor.setTo(0, 0)
  }

  setupKeyboard () {
    // Register the keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.sprintKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SHIFT
    ])
  }

  update () {
    // Check state of keys to control main character
    var speed = 0
    if (this.rightKey.isDown) { speed++ }
    if (this.leftKey.isDown) { speed-- }
    if (this.sprintKey.isDown) { speed *= 2 }

    // Update sprite facing direction
    if (speed > 0 && !this.player.isFacingRight()) {
      this.player.makeFaceRight()
    } else if (speed < 0 && !this.player.isFacingLeft()) {
      this.player.makeFaceLeft()
    }

    // Update sprite movement state and playing audio
    if (Math.abs(speed) > 1) {
      // Player is running
      this.player.moveState = MainPlayer.moveStates.RUNNING
      if (!this.game.sounds.get('running').isPlaying) {
        this.game.sounds.play('running', config.SFX_VOLUME)
      }
    } else {
      // Player is walking or stopped
      this.game.sounds.stop('running')
      if (Math.abs(speed) > 0) {
        this.player.moveState = MainPlayer.moveStates.WALKING
      } else {
        this.player.moveState = MainPlayer.moveStates.STOPPED
      }
    }
  }

  render () {
    // Optionally render some development/debugging info
    if (__DEV__) {
      // Print info about the player sprite at (32, 32) -> top left
      this.game.debug.spriteInfo(this.player, 32, 32)

      // Print some text about the player state machine
      this.game.debug.text(`Movement State: ${this.player.moveState}`, this.game.width - 350, 32)

      // Print a warning that the game is running in DEV/Debug mode
      this.game.debug.text('DEV BUILD', this.game.width - 100, this.game.height - 10, '#AA0000')
    }
  }
}

// Expose the class TestLevel to other files
export default TestLevel
