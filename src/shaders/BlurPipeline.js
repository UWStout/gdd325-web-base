/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import the GLSL fragment shader (make sure webpack is setup to use raw-loader)
import fragString from './BlurPipeline.frag'

/**
 * A custom shader pipeline that blurs the image
 */
class BlurPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
  constructor (game) {
    // Pass parameters to the parent class
    super({
      game: game,
      renderer: game.renderer,
      fragShader: fragString
    })

    // Default values for members
    this._res = { width: game.config.width, height: game.config.height }
    this.blur = 0 // NOTE: this calls the setter
  }

  // Accessors for the blur value
  get blur () { return this._blur }
  set blur (newBlur) {
    this._blur = newBlur
    this.setFloat2(BlurPipeline.U_BLUR_NAME,
      this._blur / this._res.width, this._blur / this._res.height)
  }

  /**
   * Set the resolution parameter
   * @param {Object} newRes Resolution of the buffer with a width and height parameter
   */
  set res (newRes) {
    this._res.width = newRes.width
    this._res.height = newRes.height
    this.blur = this._blur // trigger passing of uniform
  }
}

// Name of the blur uniform in the shader
BlurPipeline.U_BLUR_NAME = 'blur'

export default BlurPipeline
