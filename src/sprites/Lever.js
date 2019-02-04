/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

class Lever extends Phaser.GameObjects.Sprite {
  constructor ({ scene, x, y }) {
    // Initialize object basics
    super(scene, x, y, 'lever', 0)
    this.key = 'lever'
    this.name = 'Lever'
    this.playerBodyID = this.scene.player.body.id

    // Setup all the animations
    this.setupAnimations()
    this._currentState = 'push'

    // Setup scale
    this.setScale(3.0, 3.0)

    // Setup as a static physics object sensor
    if (this.scene.matter) {
      this.scene.matter.add.gameObject(this)
      this.setRectangle(95, 95, { isSensor: true })
      this.setStatic(this.body, true)

      // Setup callback listeners for this lever
      this.scene.matter.world.on('collisionstart', this.beginOverlap, this)
      this.scene.matter.world.on('collisionend', this.endOverlap, this)
    }

    // Setup default values
    this.setOrigin(0.5, 0.5)
    this._playerOverlapping = false
  }

  // Collision listeners
  beginOverlap (event, bodyA, bodyB) {
    if ((bodyA.id === this.body.id || bodyB.id === this.body.id) &&
      (bodyA.id === this.playerBodyID || bodyB.id === this.playerBodyID)) {
      console.log('lever collide begin')
      this._playerOverlapping = true
    }
  }

  endOverlap (event, bodyA, bodyB) {
    if ((bodyA.id === this.body.id || bodyB.id === this.body.id) &&
      (bodyA.id === this.playerBodyID || bodyB.id === this.playerBodyID)) {
      console.log('lever collide end')
      this._playerOverlapping = false
    }
  }

  activate () {
    // Only allow activation when overlapping with player
    if (this._playerOverlapping) {
      // Push or pull according to current state
      switch (this._currentState) {
        case 'pull':
          this.anims.play('push')
          this._currentState = 'unknown'
          break

        case 'push':
          this.anims.play('pull')
          this._currentState = 'unknown'
          break
      }
    }
  }

  // Function to setup all the animation data (animation names match state names)
  setupAnimations () {
    // Forward and backward animations
    this.scene.anims.create({
      key: 'pull',
      frames: this.scene.anims.generateFrameNumbers(this.key, { frames: [0, 1, 2, 3, 4] }),
      frameRate: 10,
      repeat: 0
    })

    this.scene.anims.create({
      key: 'push',
      frames: this.scene.anims.generateFrameNumbers(this.key, { frames: [4, 3, 2, 1, 0] }),
      frameRate: 10,
      repeat: 0
    })

    // When animation completes, update current state
    this.on('animationcomplete', (anim) => {
      switch (anim.key) {
        case 'pull': case 'push':
          this.emit('activated')
          this._currentState = anim.key
          break
      }
    })
  }
}

// Expose the Lever class to other files
export default Lever
