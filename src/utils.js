/**
 * utils.js: Simple, one-off functions that help reduce code in places
 * throughout your game. Put short, reusable code snippits in here.
 */

/**
 * Set the origin of all passed in objects to be (0.5, 0.5) so they
 * are drawn around their own logical center.
 * @param {array} objects An array of GameObjects objects to be centered.
 */
export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.setOrigin(0.5, 0.5)
  })
}

/**
 * Retieve the currently configured game width (likely set when the Phaser.Game was created)
 * @param {Phaser.Scene} scene Scene object to use to retrieve the game config width
 */
export const gameWidth = (scene) => {
  return scene.sys.game.config.width
}

/**
 * Retieve the currently configured game height (likely set when the Phaser.Game was created)
 * @param {Phaser.Scene} scene Scene object to use to retrieve the game config height
 */
export const gameHeight = (scene) => {
  return scene.sys.game.config.height
}

/**
 * Retieve the horizontal center of the world for the current scene
 * If the main camera has bounds, it will use those.  Otherwise, returns the width of the
 * configured game bounds divided by 2.
 * @param {Phaser.Scene} scene Scene object to use to get horizontal center
 */
export const centerX = (scene) => {
  if (scene.cameras.main.useBounds) {
    return scene.cameras.main._bounds.width / 2
  } else {
    return gameWidth(scene) / 2
  }
}

/**
 * Retieve the vertical center of the world for the current scene
 * If the main camera has bounds, it will use those.  Otherwise, returns the height of the
 * configured game bounds divided by 2.
 * @param {Phaser.Scene} scene Scene object to use to get vertical center
 */
export const centerY = (scene) => {
  if (scene.cameras.main.useBounds) {
    return scene.cameras.main._bounds.height / 2
  } else {
    return gameHeight(scene) / 2
  }
}

/**
 * Tell an EventEmitter object to log all the events prior to emitting them. This enables
 * you to figure out exactly WHAT events are emitted and when, which is otherwise impossible
 * as they are emitted using string constants and often not documented.
 * @param {Phaser.Event.EventEmitter} emitter The object that should log its emitted events
 * @param {string} objName Name for this object (included in logged events)
 * @param {string|symbol|Array[string]|Array[symbol]} ignore List of events not to log
 */
export const logEvents = (emitter, objName, ignore) => {
  // Default to nothing if no ignore is provided or its not an array
  ignore = ignore || []
  if (!Array.isArray(ignore)) { ignore = [ignore] }

  // Save reference to the original emit function
  emitter._emit_orig = emitter.emit

  // Override emit so it loggs first
  emitter.emit =
    function emit (event, a1, a2, a3, a4, a5) {
      // Log any not-ignored events
      if (!ignore.find((ignoreMe) => { return event === ignoreMe })) {
        console.log(`${objName} Emitting: ${event}`)
      }

      // Emit the event with original emit function
      this._emit_orig(event, a1, a2, a3, a4, a5)
    }
}
