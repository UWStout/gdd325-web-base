/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

class InfoScene extends Phaser.Scene {
  init (data) {
    // Data must be passed in when strting the scene
    if (data) {
      this.floorHeight = data.floorHeight || 365
    } else {
      this.floorHeight = 365
    }
  }

  preload () {}

  create () {
    // Local variables for accessing width and height
    let width = this.cameras.main.width
    let height = this.cameras.main.height

    // Setup the on-screen text
    // NOTE: floorheight is set in 'init()'
    this.setupText(this.floorHeight, width, height)
  }

  setupText (floorHeight, width, height) {
    // Control message to show on screen
    const controlText = 'L & R arrow -- walk\n' +
                        '      SHIFT -- hold to run\n' +
                        '      SPACE -- jump\n' +
                        '          E -- interact'
    let controls = this.add.text(width - 100, floorHeight + 80, controlText)

    // Configure all the control message font properties
    controls.setStyle({
      fontSize: '20px',
      fontFamily: 'Courier',
      color: '#000000'
    })
    controls.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)
    controls.setOrigin(1.0, 0)

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
    let credits = this.add.text(100, floorHeight + 50, creditsText)
    credits.setStyle({
      fontSize: '20px',
      fontFamily: 'Courier',
      color: '#000000'
    })
    credits.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)
    credits.setOrigin(0, 0)
  }
}

// Expose the class TestLevel to other files
export default InfoScene
