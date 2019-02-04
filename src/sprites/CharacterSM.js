/* globals __DEV__ */

import StateMachine from 'javascript-state-machine'

/**
 * A finite state machine used to control the movement state of any mobile character,
 * both player controlled and NPCs.
 *
 * Defined States:
 * - standing: On the grand standing still
 * - idling: Standing + playing idle animation
 * - walking / running: moving along the ground at different speeds
 * - dashing: a quick burst of speed forward
 * - jumping: in the air with upward velocity
 * - falling: in the air with downward velocity
 *
 * Defined Transitions:
 * - bored: from standing to idling
 * - walk: from standing/idling/dashing to walking
 * - run: from standing/idling/dashing to running
 * - stop: from walking/running to standing
 * - jump: from standing/idling to jumping
 * - leap: from walking/running to jumping
 * - apex: from jumping to falling
 * - landed: from falling to standing
 * - fall: from standing/walking/running to falling
 * - dash: from standing/walking/running to dashing
 */
class CharacterSM extends StateMachine {
  /**
   * Make a new Character state machine for managing character movement
   * @param {Phaser.GameObject.Sprite} sprite The sprite that will be managed by this state machine
   * @param {function} enterStateCallback A function to call whenever a new state is entered
   */
  constructor (sprite, enterStateCallback) {
    super({
      init: 'standing',
      transitions: [
        // Standing: still on the ground, Idling: bored of standing still
        { name: 'bored', from: 'standing', to: 'idling' },

        // Walking: moving slowly on the ground, Running: moving faster on the ground
        { name: 'walk', from: [ 'standing', 'idling', 'dashing', 'running' ], to: 'walking' },
        { name: 'run', from: [ 'standing', 'idling', 'dashing', 'walking' ], to: 'running' },
        { name: 'stop', from: [ 'walking', 'running' ], to: 'standing' },

        // Jump: moving upward while in the air
        { name: 'jump', from: [ 'standing', 'idling' ], to: 'jumping' },
        { name: 'leap', from: [ 'walking', 'running' ], to: 'jumping' },

        // Falling: moving downward while in the air
        { name: 'apex', from: 'jumping', to: 'falling' },
        { name: 'landed', from: 'falling', to: 'standing' },
        { name: 'fall', from: [ 'standing', 'walking', 'running' ], to: 'falling' },

        // Dashing: quick surge forward
        { name: 'dash', from: [ 'standing', 'walking', 'running' ], to: 'dashing' }
      ]
    })

    this.characterSprite = sprite
    this.enterStateCB = enterStateCallback
  }

  // Override the 'onEnterState' lifecycle function
  onEnterState ({ transition, from, to }) {
    // If there is a custom callback set and this is not the 'init' transition
    if (this.enterStateCB && transition !== 'init') {
      // ... then call that callback
      this.enterStateCB(transition, from, to)
    }
  }
}

// Expose the CharacterSM class to other files
export default CharacterSM
