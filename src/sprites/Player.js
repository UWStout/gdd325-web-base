/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import config from '../config'

// Bring in the base character state-machine for use
import CharacterSM from './CharacterSM'

/**
 * The main player-controllable sprite. This class encapsulates the logic for the main
 * player sprite with all of it's animations and states. It includes a simple, hard-coded
 * movement state-machine that coordinates transitions between differnt movement states
 * and the idle state. It shows examples of setting up animations that are embedded in a
 * larger sprite-sheet and carefule management of the current state. No physics are used
 * in this example, only basic animation.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class MainPlayer extends Phaser.GameObjects.Sprite {
  constructor ({ scene, x, y }) {
    // Initialize object basics
    super(scene, x, y, 'player-main')
    this.key = 'player-main'
    this.name = 'Main Player'

    // Setup all the animations and the state machine
    this.setupAnimations()
    this._moveFSM = new CharacterSM(this, this.enteringNewState.bind(this))
    this.anims.play('standing')

    // These variables come from config.js rather than being hard-coded here so
    // they can be easily changed and played with
    this._SCALE = config.PLAYER_SCALE
    this._idle_countdown = config.IDLE_COUNTDOWN

    // Create sound sprite for running SFX
    this.runningSFX = this.scene.sound.addAudioSprite('sounds')

    // Initialize the scale of this sprite
    this.setScale(this._SCALE)

    // Keep track of falling speed
    this.maxAirSpeed = 0

    // Setup player physics
    if (this.scene.matter) {
      this.scene.matter.add.gameObject(this)
      this.setRectangle(60, 120, { inertia: Infinity })
      this.setOrigin(0.5, 0.69)
    } else {
      this.setOrigin(0.5, 1.0)
    }
  }

  // Expose state machine for external management
  get currentState () { return this._moveFSM.state }
  do (transition) {
    // Execute the given transition IF it is allowed
    if (this._moveFSM.can(transition)) {
      this._moveFSM[transition]()
    }
  }

  // Update animation to match state (called only when state changes)
  enteringNewState () {
    // Anything extra when starting this animation?
    switch (this._moveFSM.state) {
      case 'standing':
        // Restart the idle countdown
        this._idle_countdown = config.IDLE_COUNTDOWN
        break

      case 'jumping':
        this.setVelocityY(-10)
        break
    }

    // Trigger running sfx
    if (this._moveFSM.state === 'running') {
      if (!this.runningSFX.isPlaying) {
        this.runningSFX.play('running', { volume: this.runningSFX.volume })
      }
    } else {
      this.runningSFX.stop()
    }
    
    // Play the indicated animation (state names and animation names must match!)
    if (__DEV__) { console.log(`Playing ${this._moveFSM.state}`) }
    this.anims.play(this._moveFSM.state)
  }

  setSFXVolume (newVolume) {
    this.runningSFX.volume = newVolume
  }

  // Function that runs every tick to update this sprite
  update (time, delta) {
    // Account for falling
    if (this.body.velocity.y > 0.8 && this.currentState !== 'falling') {
      this.do('fall')
    } else {
      // Update according to the current state
      switch (this.currentState) {
        case 'walking':
          this.setVelocityX(this.flipX ? -3.5 : 3.5)
          break

        case 'running':
          this.setVelocityX(this.flipX ? -7 : 7)
          break

        case 'jumping':
          // At the apex of the jump, transition to falling
          if (this.body.velocity.y > 0) {
            this.do('apex')
          }
          break

        case 'falling':
          // Keep track of max falling speed (for purposes of impact)
          if (this.body.velocity.y > this.maxAirSpeed) {
            this.maxAirSpeed = this.body.velocity.y
          }

          // When y velocity dampens out, go back to standing
          if (Math.abs(this.body.velocity.y) < 0.1) {
            this.do('landed')

            // If moving fast enough, shake the screen to simulate impact
            if (this.maxAirSpeed > 3) {
              this.scene.cameras.main.shake(50, 0.001 * this.maxAirSpeed)
            }

            // Reset the max air speed variable
            this.maxAirSpeed = 0
          }
          break

        // Automatically switch from standing to idle after designated countdown
        case 'standing':
          if (this._idle_countdown <= 0) {
            this.do('bored')
          } else {
            this._idle_countdown -= 1
          }
          break

        // Do nothing in these states
        default:
        case 'idling':
          break
      }
    }
  }

  // Function to setup all the animation data (animation names match state names)
  setupAnimations () {
    // Basic movement animations
    this.scene.anims.create({
      key: 'standing',
      frames: [{ key: this.key, frame: 48 }],
      frameRate: 1,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'walking',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'running',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    })

    // Different parts of the idle animation
    this.scene.anims.create({
      key: 'idling',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 48, end: 62 }),
      frameRate: 4,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'idle_breath',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 48, end: 60 }),
      frameRate: 4,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'idle_yoyo',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 144, end: 183 }),
      frameRate: 8,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'idle_kick',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 63, end: 71 }),
      frameRate: 8,
      repeat: 0
    })

    // Action animations
    // Note: these are not used in this example but are in the spritesheet
    this.scene.anims.create({
      key: 'dashing',
      frames: this.scene.anims.generateFrameNumbers(this.key, { start: 34, end: 37 }),
      frameRate: 20,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'jumping',
      frames: [{ key: this.key, frame: 96 }],
      frameRate: 1,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'falling',
      frames: [{ key: this.key, frame: 84 }],
      frameRate: 1,
      repeat: 0
    })

    // Setup the different idle animations to automatically trigger each other so it
    // makes a nice long, distinct idle animation that loops forever
    this.on('animationcomplete', (anim) => {
      switch (anim.key) {
        case 'idling': this.anims.play('idle_yoyo'); break
        case 'idle_yoyo': this.anims.play('idle_breath'); break
        case 'idle_breath': this.anims.play('idle_kick'); break
        case 'idle_kick': this.anims.play('idling'); break
      }
    })
  }
}

// Expose the MainPlayer class to other files
export default MainPlayer
