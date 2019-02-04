/**
 * config.js: Global configuration details meant to be used in files throughout
 * your game. Values included here should be ones that help you tweek your game
 * or avoid writing constants more than once.
 *
 * THESE VALUES SHOULD BE TREATED AS CONSTANT/READ ONLY!!
 * If you need to change their values during run-time then they don't belong here.
 */

export default {
  gameWidth: 1000, // The width of the game viewport in the browser
  gameHeight: 666, // The height of the game viewport in the browser
  localStorageName: 'stoutGDD325', // Prefix for cookie & session storage

  // List of webfonts you want to load
  webfonts: ['Libre Franklin'],

  // Sound and music settings
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.8,

  // Minimum time to display the splash screen
  MIN_SPLASH_SECONDS: 2,

  // Time before playing the idle animation
  IDLE_COUNTDOWN: 200,

  // Values for tweeking the player character behaviors
  PLAYER_SCALE: 3.0,
  PLAYER_MASS: 5
}
