/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Utility functions
import { centerGameObjects } from '../utils'

// Colors for the slider
const SLIDER_PRIMARY = 0x4e342e
const SLIDER_LIGHT = 0x7b5e57
const SLIDER_DARK = 0x260e04

class PauseMenuScene extends Phaser.Scene {
  init (data) {
    // Data must be passed in when strting the scene
    if (data) {
      this.parentScene = data.parent || 'Test'
      this.musicVolume = data.musicVolume || 1.0
      this.sfxVolume = data.sfxVolume || 1.0
    } else {
      this.parentScene = 'Test'
      this.musicVolume = 1.0
      this.sfxVolume = 1.0
    }
  }

  preload () {}

  create () {
    // Local variables for accessing width and height
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.setupKeyboard()
    this.setupAudio()

    // Setup the on-screen menu
    this.setupMenu(width, height)
  }

  setupKeyboard () {
    // Setup escape key for unpausing
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    this.escKey.oldDown = false

    // Plus and minus for music volume
    this.plusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS)
    this.minusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS)

    // Brackets for SFX volume
    this.closeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET)
    this.openKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET)
  }

  setupAudio () {
    // Create an instance of the audiosprite to play the music
    this.music = this.sound.addAudioSprite('sounds')
    this.music.volume = this.musicVolume

    // Separate instance of audiosprite for the running sound (so it can play over music)
    this.runningSFX = this.sound.addAudioSprite('sounds')
    this.runningSFX.volume = this.sfxVolume
  }

  setupMenu (width, height) {
    // Background for the menu
    const recWidth = 0.9 * width
    const recHeight = 0.9 * height
    const background = this.add.rectangle(
      width / 2, height / 2,
      recWidth, recHeight,
      0x999999, 1.0)

    // Simple pause message
    const message = this.add.text(width / 2, height / 2, 'Paused (press esc to resume)')

    // Configure all the control message font properties
    message.setStyle({
      fontSize: '20px',
      fontFamily: 'Courier',
      color: '#ffffff'
    })
    message.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)

    // Center all objects
    centerGameObjects([background, message])

    // Text label for the music slider
    const musicVolLabel = this.add.text(width / 2 - 220, 200, 'Music Volume:')
    musicVolLabel.setOrigin(1.0, 0.5)

    // Value lable for the music slider
    const musicVolValLabel = this.add.text(width / 2 + 220, 200, '100')
    musicVolValLabel.setOrigin(0.0, 0.5)

    // Add a slider for muisic volume control
    this.musicSlider = this.rexUI.add.slider({
      x: width / 2,
      y: 200,
      width: 400,
      height: 20,
      orientation: 'y',

      track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, SLIDER_DARK),
      indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, SLIDER_PRIMARY),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 15, SLIDER_LIGHT),

      input: 'click', // 'drag'|'click'
      valuechangeCallback: (value) => {
        this.music.volume = value
        musicVolValLabel.text = (value * 100).toFixed(0)
      }
    })
    this.musicSlider.value = this.music.volume
    this.musicSlider.layout()

    // Text label for the sfx slider
    const sfxVolLabel = this.add.text(width / 2 - 220, 250, 'SFX Volume:')
    sfxVolLabel.setOrigin(1.0, 0.5)

    // Value label for the sfx slider
    const sfxVolValLabel = this.add.text(width / 2 + 220, 250, '100')
    sfxVolValLabel.setOrigin(0.0, 0.5)

    // Add a slider for sfx volume control
    this.sfxSlider = this.rexUI.add.slider({
      x: width / 2,
      y: 250,
      width: 400,
      height: 20,
      orientation: 'y',

      track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, SLIDER_DARK),
      indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, SLIDER_PRIMARY),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 15, SLIDER_LIGHT),

      input: 'click', // 'drag'|'click'
      valuechangeCallback: (value) => {
        this.runningSFX.volume = value
        sfxVolValLabel.text = (value * 100).toFixed(0)
      }
    })
    this.sfxSlider.value = this.runningSFX.volume
    this.sfxSlider.layout()

    // Pointer down events to start playing music/sfx
    // Also disabled the other slider to avoid unintential input
    this.musicSlider.on('pointerdown', () => {
      if (this.music.isPaused) {
        this.music.resume()
      } else if (!this.music.isPlaying) {
        this.music.play('music-theme2')
      }
      this.sfxSlider.input.enabled = false
    })

    this.sfxSlider.on('pointerdown', () => {
      this.runningSFX.play('running')
      this.musicSlider.input.enabled = false
    })

    // Mouse/touch up to stop the music/sfx and renable the other slider
    this.input.addListener('pointerup', () => {
      if (this.runningSFX.isPlaying) {
        this.runningSFX.stop()
      }

      if (this.music.isPlaying) {
        this.music.pause()
      }

      this.musicSlider.input.enabled = true
      this.sfxSlider.input.enabled = true
    }, this)
  }

  update () {
    // Control music volume with +/- keys
    if (this.plusKey.isDown) {
      if (this.music.isPaused) { this.music.resume() }
      else if (!this.music.isPlaying) { this.music.play('music-theme2') }
      this.musicSlider.value = this.musicSlider.value + 0.01
      this.musicPlayedForKey = true
    } else if (this.minusKey.isDown) {
      if (this.music.isPaused) { this.music.resume() }
      else if (!this.music.isPlaying) { this.music.play('music-theme2') }
      this.musicSlider.value = this.musicSlider.value - 0.01
      this.musicPlayedForKey = true
    } else if (this.musicPlayedForKey) {
      this.music.pause()
      this.musicPlayedForKey = false
    }

    // Control sfx volume with [/] keys
    if (this.closeKey.isDown) {
      if (!this.runningSFX.isPlaying) { this.runningSFX.play('running') }
      this.sfxSlider.value = this.sfxSlider.value + 0.01
      this.sfxPlayedForKey = true
    } else if (this.openKey.isDown) {
      if (!this.runningSFX.isPlaying) { this.runningSFX.play('running') }
      this.sfxSlider.value = this.sfxSlider.value - 0.01
      this.sfxPlayedForKey = true
    } else if (this.sfxPlayedForKey) {
      this.runningSFX.stop()
      this.sfxPlayedForKey = false
    }

    // When escape is pressed, resume
    if (this.escKey.isDown && !this.escKey.oldDown) {
      // Avoid spamming a key
      this.escKey.oldDown = true

      // Shut down this scene and resume the old one
      console.log('resuming')
      this.scene.resume(this.parentScene, {
        musicVolume: this.music.volume,
        sfxVolume: this.runningSFX.volume
      })
      this.scene.stop()
      return
    }

    if (this.escKey.isUp) {
      this.escKey.oldDown = false
    }
  }
}

// Expose the class TestLevel to other files
export default PauseMenuScene
