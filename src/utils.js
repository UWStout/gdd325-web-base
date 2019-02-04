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
