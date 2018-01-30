/* globals __DEV__ */
import { sequentialNumArray } from '../utils.js'
import config from '../config'
import Phaser from 'phaser'

class MainPlayer extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // Initialize object basics
    super(game, x, y, 'player-main', 0)
    this.name = 'Main Player'
    this.anchor.setTo(0.5, 1.0)
    this.smoothed = false
    this.game = game

    // Setup all the animations
    this.setupAnimations()

    // All variabes that start with '_' are meant to be private
    // Initial state is stopped
    this._move_state = MainPlayer.moveStates.UNKNOWN
    this._SCALE = config.PLAYER_SCALE
    this._idle_countdown = config.IDLE_COUNTDOWN

    // Initialize the sprite scale
    this.scale.setTo(this._SCALE)
  }

  // Setter and getter for the 'state' property
  get moveState () { return this._move_state }

  set moveState (newState) {
    if (this._move_state !== newState &&
        (this._move_state !== MainPlayer.moveStates.IDLE ||
         newState !== MainPlayer.moveStates.STOPPED)) {
      // Update the state
      this._move_state = newState
      this.updateAnimation()
    }
  }

  // Functions to help manage the way the character is facing
  isFacingRight () { return (this.scale.x > 0) }
  isFacingLeft () { return (this.scale.x < 0) }

  makeFaceRight () { this.scale.set(this._SCALE, this._SCALE) }
  makeFaceLeft () { this.scale.set(-this._SCALE, this._SCALE) }

  makeAboutFace () {
    if (this.facingRight()) {
      this.makeFaceLeft()
    } else {
      this.makeFaceRight()
    }
  }

  // Update animation to match state (called only when state changes)
  updateAnimation () {
    switch (this._move_state) {
      case MainPlayer.moveStates.STOPPED:
        if (__DEV__) console.info('Playing "stop"')
        this.animations.play('stop')
        this._idle_countdown = config.IDLE_COUNTDOWN
        break

      case MainPlayer.moveStates.WALKING:
        if (__DEV__) console.info('Playing "walk"')
        this.animations.play('walk')
        break

      case MainPlayer.moveStates.RUNNING:
        if (__DEV__) console.info('Playing "run"')
        this.animations.play('run')
        break

      case MainPlayer.moveStates.IDLE:
        if (__DEV__) console.info('Playing "idle"')
        this.animations.play('idle_breath')
        break
    }
  }

  // Function that runs every tick to update this sprite
  update () {
    // Always give parent a chance to update
    super.update()

    // Automatically switch to idle after designated countdown
    if (this.moveState === MainPlayer.moveStates.STOPPED) {
      if (this._idle_countdown <= 0) {
        this.moveState = MainPlayer.moveStates.IDLE
      } else {
        this._idle_countdown -= 1
      }
    }
  }

  // Function to setup all the animation data
  setupAnimations () {
    this.animations.add('stop', [48], 1, false)
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
    this.animations.add('run', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)

    this.animations.add('idle_breath', sequentialNumArray(48, 62), 4, false)
    this.animations.add('idle_breath2', sequentialNumArray(48, 60), 4, false)
    this.animations.add('idle_yoyo', sequentialNumArray(144, 183), 8, false)
    this.animations.add('idle_kick', sequentialNumArray(63, 71), 8, false)

    this.animations.add('dash', [34, 35, 36, 37], 20, false)
    this.animations.add('jump', [96], 10, true)
    this.animations.add('fall', [84], 10, true)

    // Setup the multi-stage idle animation loop
    this.animations.getAnimation('idle_breath').onComplete.add(() => {
      this.play('idle_yoyo')
    }, this)

    this.animations.getAnimation('idle_yoyo').onComplete.add(() => {
      this.play('idle_breath2')
    }, this)

    this.animations.getAnimation('idle_breath2').onComplete.add(() => {
      this.play('idle_kick')
    }, this)

    this.animations.getAnimation('idle_kick').onComplete.add(() => {
      this.play('idle_breath')
    }, this)
  }
}

// All possible player 'states'
MainPlayer.moveStates = Object.freeze({
  UNKNOWN: 'unknown',
  STOPPED: 'stopped',
  WALKING: 'walking',
  RUNNING: 'running',
  IDLE: 'idle'
})

export default MainPlayer
