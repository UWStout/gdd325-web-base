/* globals __DEV__ */
import Phaser from 'phaser'
import MainPlayer from '../sprites/Player'
import config from '../config'

export default class extends Phaser.State {
  init () {}

  preload () {
    // Set/Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  create () {
    // Start the P2 Physics Engine
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)
    this.game.physics.p2.gravity.y = config.GRAVITY_CONSTANT

    // Create and add the main player object
    this.player = new MainPlayer({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY
    })

    // Compute values for the floor and update the config
    config.GLOBAL_FLOOR = this.game.world.centerY + this.player.getBounds().height / 2
    config.PLAYER_FLOOR = this.player.y

    // Create the floor
    this.floor = this.game.add.graphics(0, 0)
    this.game.physics.p2.enableBody(this.floor)
    this.floor.body.static = true

    let floorHeight = config.GLOBAL_FLOOR + this.player.height / config.PLAYER_SCALE
    this.floor.beginFill(0xabb8c2)
    this.floor.drawRect(0, floorHeight, this.game.world.width, this.game.world.height / 2)
    this.floor.endFill()

    // To prevent character falling out of world
    this.game.world.setBounds(0, 0, this.game.width, config.GLOBAL_FLOOR)

    // Show message on screen
    const bannerText = 'UW Stout / GDD 325 - 2D Web Game Base'

    let banner = this.add.text(this.world.centerX, 180, bannerText)
    banner.font = 'Libre Franklin'
    banner.padding.set(10, 16)
    banner.fontSize = 30
    banner.fontWeight = 'bolder'
    banner.stroke = '#FFFFFF'
    banner.strokeThickness = 1
    banner.fill = '#012169'
    banner.anchor.setTo(0.5)

    const controlText = 'L & R arrow -- walk\n' +
                        '      SHIFT -- hold to run\n' +
                        '   SPACEBAR -- dash\n' +
                        '   UP arrow -- jump'
    let controls = this.add.text(this.game.width - 100, floorHeight + 60, controlText)
    controls.font = 'Courier'
    controls.padding.set(10, 0)
    controls.fontSize = 18
    controls.fill = '#000000'
    controls.anchor.setTo(1.0, 0)

    const creditsText = 'Based on "The Great Tsunami Theif":\n' +
                        '     Colton Barto -- Programming\n' +
                        ' Nicole Fairchild -- Art\n' +
                        '   Maria Kastello -- Programming\n' +
                        '     Austin Lewer -- Art\n' +
                        '    Austin Martin -- Music\n' +
                        '    Cole Robinson -- Programming\n' +
                        '       Shane Yach -- Programming'

    let credits = this.add.text(100, floorHeight + 20, creditsText)
    credits.font = 'Courier'
    credits.padding.set(10, 0)
    credits.fontSize = 14
    credits.fill = '#000000'
    credits.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)
    credits.anchor.setTo(0, 0)

    // Add player after the floor
    this.game.add.existing(this.player)

    // Setup all the audio
    this.setupAudio()
    this.sounds.play('music-intro', config.MUSIC_VOLUME)

    // Setup the key objects
    this.setupKeyboard()
  }

  setupAudio () {
    // Load the audio sprite into the level
    let sounds = this.sounds = this.game.add.audioSprite('sounds')

    // Make the different music sections flow into one another
    // in a seamless loop
    this.sounds.get('music-intro').onStop.add(() => {
      sounds.play('music-theme1', config.MUSIC_VOLUME)
    })

    for (let i = 1; i < 4; i++) {
      this.sounds.get(`music-theme${i}`).onStop.add(() => {
        sounds.play(`music-theme${i + 1}`, config.MUSIC_VOLUME)
      })
    }

    this.sounds.get('music-theme4').onStop.add(() => {
      sounds.play('music-bridge', config.MUSIC_VOLUME)
    })

    // Theme 2 seems to flow out of the bridge better than theme 1
    this.sounds.get('music-bridge').onStop.add(() => {
      sounds.play('music-theme2', config.MUSIC_VOLUME)
    })
  }

  setupKeyboard () {
    //  Register the keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.dashKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.sprintKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)

    //  Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT
    ])
  }

  update () {
    // Check for dash by itself
    if (this.dashKey.justPressed() && !this.player.action) {
      this.player.actionState = MainPlayer.actionStates.DASHING
      this.sounds.stop('running')
      this.sounds.play('dash', config.SFX_VOLUME)
    } else if (this.jumpKey.justPressed() && !this.player.action) {
      this.player.actionState = MainPlayer.actionStates.JUMPING
      this.sounds.stop('running')
    } else {
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

      // Update state of movement
      if (Math.abs(speed) > 1) {
        this.player.moveState = MainPlayer.moveStates.RUNNING
        if (!this.player.action && !this.sounds.get('running').isPlaying) {
          this.sounds.play('running', config.SFX_VOLUME)
        }
      } else if (Math.abs(speed) > 0) {
        this.player.moveState = MainPlayer.moveStates.WALKING
        this.sounds.stop('running')
      } else {
        this.player.moveState = MainPlayer.moveStates.STOPPED
        this.sounds.stop('running')
      }
    }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
      this.game.debug.text(
        `Movement: ${this.player.moveState}, Action: ${this.player.actionState}`,
        this.game.width - 350, 32)
      this.game.debug.text('DEV BUILD', this.game.width - 100, this.game.height - 10, '#AA0000')
    }
  }
}
