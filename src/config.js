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

  // *** Everything below this is specific to the demo code.
  // *** You should probably REMOVE it or adjust the values.
  // *** In fact, some of these are quick hacks and not recommended!!

  // Sound and music settings
  MUSIC_VOLUME: 0.1,
  SFX_VOLUME: 1.0,

  // Minimum time to display the splash screen
  MIN_SPLASH_SECONDS: 2,

  // Time before playing the idle animation
  IDLE_COUNTDOWN: 200,

  // Values for tweeking the player character behaviors
  PLAYER_SCALE: 3.0,
  PLAYER_MASS: 5,
  JUMP_INITIAL: -400,
  JUMP_TIME: 0.4,
  GRAVITY_CONSTANT: 1000
}
