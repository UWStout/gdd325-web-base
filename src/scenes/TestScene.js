/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the global config file
import config from '../config'

// Import the main player sprite
import MainPlayer from '../sprites/Player'

// Import the interactive lever sprite
import Lever from '../sprites/Lever'

// Import the special blur filter
import BlurPipeline from '../shaders/BlurPipeline'

class TestScene extends Phaser.Scene {
  init (data) { }

  preload () {
    // Add custom render pipeline for the blur filter
    this.blurPipeline = this.game.renderer.addPipeline('BlurFilter', new BlurPipeline(this.game))
  }

  create () {
    // Local variables for accessing width and height
    const width = this.game.config.width
    const height = this.game.config.height

    // Start playing the background music
    this.setupAudio()
    this.music.play('music-intro', { volume: config.MUSIC_VOLUME })

    // Create and add the main player object
    this.player = new MainPlayer({
      scene: this,
      x: width / 2,
      y: height / 2 + 32
    })
    this.player.setSFXVolume(config.SFX_VOLUME)

    // Setup the camera
    this.setupCamera()

    // Compute a reasonable height for the floor based on the height of the player sprite
    const floorHeight = this.player.y
    this.floor = this.add.graphics()
    this.floor.fillStyle(0xabb8c2, 1.0)
    this.floor.fillRect(0, floorHeight, this.cameras.main._bounds.width, height / 2)

    // Add the lever
    this.lever = new Lever({
      scene: this,
      x: width / 2 + 400,
      y: floorHeight - 48
    })
    this.add.existing(this.lever)
    this.lever.on('activated', (event) => {
      this.setupCrates(floorHeight)
    }, this)

    // Add player after the floor and lever
    this.add.existing(this.player)
    this.updates.add(this.player)

    // Setup the key objects
    this.setupKeyboard()

    // Setup a few custom event responders
    this.events.on('render', this.render, this)
    this.events.on('pause', this.paused, this)
    this.events.on('resume', this.resumed, this)

    // Setup the banner text which is in THIS scene
    // This means it scrolls with the camera
    this.setupText()

    // Start the info scene in parallel as an overlay
    // This means is does NOT scroll with the camera (at least not this scene's camera)
    this.scene.run('Info', { floorHeight })

    if (__DEV__) {
      this.debugDraw.bringToTop()
    }

    this.matter.world.setBounds(0, 0, this.cameras.main._bounds.width, floorHeight, 64, true, true, false, true)
  }

  setupText () {
    // Title message to show on screen
    const bannerText = 'UW Stout / GDD 325 - 2D Web Game Base'
    const banner = this.add.text(this.game.config.width / 2, 120, bannerText)

    // Configure all the title message font properties
    banner.setStyle({
      fontSize: '30px',
      fontFamily: 'Libre Franklin',
      fontWeight: 'bolder',
      color: '#012169',
      stroke: '#FFFFFF',
      strokeThickness: 2
    })
    banner.setOrigin(0.5)

    // Title message to show on screen
    const banner2Text = 'Brought to you by Seth Berrier'
    const banner2 = this.add.text(this.cameras.main._bounds.width - this.game.config.width / 2, 120, banner2Text)

    // Configure all the title message font properties
    banner2.setStyle({
      fontSize: '30px',
      fontFamily: 'Libre Franklin',
      fontWeight: 'bolder',
      color: '#012169',
      stroke: '#FFFFFF',
      strokeThickness: 2
    })
    banner2.setOrigin(0.5)
  }

  setupCrates (floorHeight) {
    // Delete the old crates if they exist
    if (this.crateGroup) {
      this.crateGroup.children.each((crate) => {
        crate.destroy()
      })
      this.crateGroup.destroy()
    }

    // Create some crates! (we use a group to add a bunch at once, FANCY)
    this.crateGroup = this.add.group({
      key: 'crate',
      frameQuantity: 5,
      setXY: { x: 1200, y: floorHeight - 105, stepX: 0, stepY: -80 }
    })

    // Turn on physics for the crates
    this.crateGroup.children.each((crate) => {
      this.matter.add.gameObject(crate, { shape: 'rectangle' })
    })
  }

  setupAudio () {
    // Create an instance of the audiosprite to play the music
    this.music = this.sound.addAudioSprite('sounds')

    // Make the music flow continuously
    this.music.on('complete', (sound) => {
      switch (sound.currentMarker.name) {
        case 'music-intro': this.music.play('music-theme1', { volume: this.music.volume }); break
        case 'music-theme1': this.music.play('music-theme2', { volume: this.music.volume }); break
        case 'music-theme2': this.music.play('music-theme3', { volume: this.music.volume }); break
        case 'music-theme3': this.music.play('music-theme4', { volume: this.music.volume }); break
        case 'music-theme4': this.music.play('music-bridge', { volume: this.music.volume }); break
        case 'music-bridge': this.music.play('music-theme2', { volume: this.music.volume }); break
      }
    }, this)
  }

  setupKeyboard () {
    // Handy way to setup cursor keys (and spacebar and shift)
    this.cursors = this.input.keyboard.createCursorKeys()

    // Setup 'e' key for interaction
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.interactKey.oldDown = false

    // Setup escape key for pausing
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    this.escKey.oldDown = false
  }

  setupCamera () {
    // Setup our camera with world bounds and make it follow the player
    this.cameras.main.setBounds(0, 0, 2000, this.game.config.height)
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setRenderToTexture('BlurFilter')
    this.blurPipeline.res = {
      width: this.cameras.main.width,
      height: this.cameras.main.height
    }

    // Setup blur in and out lerps
    this.blurOut = this.add.tween({
      targets: this.blurPipeline,
      blur: 4,
      ease: 'Linear',
      duration: 500,
      paused: true,
      onComplete: this.showPauseMenu.bind(this)
    })

    this.blurIn = this.add.tween({
      targets: this.blurPipeline,
      blur: 0,
      ease: 'Linear',
      duration: 500,
      paused: true,
      onComplete: () => {
        this.pauseTransition = false
        this.matter.world.resume()
        this.anims.resumeAll()
      }
    })
  }

  showPauseMenu () {
    console.log('Showing Pause Menu')
    this.pauseTransition = false
    this.scene.pause()
    this.scene.launch('PauseMenu', {
      parentScene: 'Test',
      musicVolume: this.music.volume,
      sfxVolume: this.player.runningSFX.volume
    })
    this.scene.bringToTop('PauseMenu')
  }

  update (time, delta) {
    // Ignore remaining updates while transition pausing
    if (this.pauseTransition) return

    // Check for pause
    if (this.escKey.isDown && !this.escKey.oldDown) {
      console.log('pausing')
      this.matter.world.pause()
      this.anims.pauseAll()
      this.escKey.oldDown = true
      this.pauseTransition = true
      if (this.blurOut.paused) this.blurOut.play()
      else this.blurOut.restart()
    }

    if (this.escKey.isUp) {
      this.escKey.oldDown = false
    }

    // Check for interact key
    if (this.interactKey.isDown && !this.interactKey.oldDown) {
      this.interactKey.oldDown = true
      this.lever.activate()
    }

    if (this.interactKey.isUp) {
      this.interactKey.oldDown = false
    }

    // Prepare to check motion
    let speed = 0

    // Check state of keys to control main character
    if (this.cursors.right.isDown) { speed++ }
    if (this.cursors.left.isDown) { speed-- }
    if (this.cursors.shift.isDown) { speed *= 2 }

    // Determine facing direction
    const absSpeed = Math.abs(speed)
    if (absSpeed !== 0) {
      this.player.setFlipX(absSpeed !== speed)
    }

    // Transition to moving
    if (absSpeed > 1) {
      this.player.do('run')
    } else if (absSpeed > 0) {
      this.player.do('walk')
    } else {
      this.player.do('stop')
    }

    // Transition to jumping
    if (this.cursors.space.isDown) {
      if (absSpeed > 0) {
        this.player.do('leap')
      } else {
        this.player.do('jump')
      }
    }
  }

  paused () {
    this.music.pause()
  }

  resumed (sceneSystems, data) {
    // Respond to volume changes if any
    if (data.musicVolume) {
      this.music.volume = data.musicVolume
    }

    if (data.sfxVolume) {
      this.player.setSFXVolume(data.sfxVolume)
    }

    this.music.resume()
    this.input.keyboard.resetKeys()
    this.pauseTransition = true
    if (this.blurIn.paused) this.blurIn.play()
    else this.blurIn.restart()
  }

  render () {
  }
}

// Expose the class TestScene to other files
export default TestScene
