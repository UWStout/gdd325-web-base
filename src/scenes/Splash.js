// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import { centerGameObjects, centerX, centerY } from '../utils'

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading. It should ensure it is always
 * displayed some mimimum amount of time (in case the assets are already cached
 * locally) and it should have pre-loaded any assets it needs to display in Boot
 * before it is run. Generally only runs once, after Boot, and cannot be re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Splash extends Phaser.Scene {
  // Initialize some local settings for this state
  init () {
  }

  preload () {
    // Add the logo to the screen and center it
    this.logo = this.add.sprite(centerX(this), centerY(this) - 100, 'logo')
    this.logo.setScale(0.5, 0.5)
    centerGameObjects([this.logo])

    this.setupProgressBar(200)

    // Load all the assets needed for next state

    // The main player spritesheet
    this.load.spritesheet('player-main', 'assets/images/player-main.png', { frameWidth: 64, frameHeight: 64 })

    // The crate sprite image
    this.load.image('crate', 'assets/images/crate.png')

    // The spritesheet for the lever
    this.load.spritesheet('lever', 'assets/images/lever.png', { frameWidth: 32, frameHeight: 32 })

    // The audiosprite with all music and SFX
    this.load.audioSprite('sounds', 'assets/audio/sounds.json', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ])

    // Load a bunch of junk to slow down the preloader
    for (let i = 0; i < 500; i++) {
      this.load.image(`logo${i}`, './assets/images/icon.png')
    }
  }

  setupProgressBar (yOffset) {
    // Local variables for accessing width and height
    let width = this.cameras.main.width
    let height = this.cameras.main.height

    // Create graphics assets for progress bar
    let progressBar = this.add.graphics()
    let progressBkg = this.add.graphics()
    progressBkg.fillStyle(0x222222, 0.8)
    progressBkg.fillRect(width / 2 - 160, height / 2 - 25 + yOffset, 320, 50)

    // Create loading text
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50 + yOffset,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    let percentText = this.make.text({
      x: width / 2,
      y: height / 2 + yOffset,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50 + yOffset,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    })

    centerGameObjects([percentText, loadingText, assetText])

    // Display the progress bar
    this.load.on('progress', (percent) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15 + yOffset, 300 * percent, 30)
      percentText.setText(`${parseInt(percent * 100)}%`)
    })

    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`)
    })

    this.load.on('complete', () => {
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
      progressBar.destroy()
      progressBkg.destroy()
    })
  }

  // Pre-load is done
  create () {
  }

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    this.scene.start('Test')
  }
}

// Expose the Splash class for use in other modules
export default Splash
