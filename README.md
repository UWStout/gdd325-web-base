# GDD 325: 2D Web Game Base
#### A code base for student games developed in GDD 325 at UW Stout


# Setup
Begin by downloading the latest release version form the 'releases' on GitHub. You may also fork or clone this repo however you will then have the entire revision history of THIS repo in addition to your own and this is not recommended.

Make sure you have downloaded and installed the *LTS version* of [node.js](https://nodejs.org/) then follow the instructions for setup starting from step 3 in the [original project](https://github.com/lean/phaser-es6-webpack) readme.

# Customization
You should imeadiately edit lines 2-5 in the package.json file with your team's and game's details. Do not put any of your personal details as this will be shared among the entire team.

You should also edit index.html and set the title to something meaningful for your game. Of course these details may change later in the semester so be sure to remember to keep them in sync.

# Phaser Community Edition
This project is based on phaser-ce ('community edition', sometimes called Phaser 2). It is not what you find when you go to phaser.io (this web site is largely outdated as the makers of phaser that maintain this site have moved on to version 3 which is still in alpha).

The best browsable documentation for *phaser-ce* is available online at (https://photonstorm.github.io/phaser-ce/index.html). You can download this documentation to browse locally by grabbing the latest copy of the 'docs' folder at the [phaser-ce repo](https://github.com/photonstorm/phaser-ce) (just open index.html in your browser).

# Project Structure
The various folders in the project directory all serve specific purposes. Please try to adhere to the conventions listed below when adding new files to your project so that things stay organized and it is easier to work concurrently without stepping on each other's toes.

The project folders are structured as follows:
* __src__ - All of your JavaScript code goes here.
* __src/states__ - JS code for the various game states (levels, menus, etc.)
* __src/sprites__ - JS code for each sprite (NOT the images/spritesheets)
* __assets__ - All data/assets go here (both binary and JSON encoded). Use sub-folder to separate assets by type (e.g. _assets/images_ for all images).

The following folders are managed by the tools and are automatically generated (therefore KEEP OUT):
* __dist__ - Babel/Webpack generated files will appear hear once you compile.
* __node_modules__ - These are packages used by node (lots of JS libraries).

The initial project files are just a starting point and will change as you develop your game. You can add as many additional files as you like but please stick to the guidelines mentioned above for folders. You may also delete files you don't use BUT use caution doing this as you may find it useful later on.

The initial files are structured as follows:
* __index.html__ - The entry point for your game from which all code is loaded and run.

* __src/main.js__ - The code starts here. All states should be loaded and the initial state activated.
* __src/config.js__ - Global code configuration constants belong here.
* __src/utils.js__ - Frequently used helper functions that are not part of any specific object belong here.

* __src/states/Boot.js__ - A 'bootstrap' state used to quickly pre-load assets needed for the loading splash screen (fonts, a loading image, sprites for a loading bar, loading music, etc.)
* __src/states/Splash.js__ - A 'splash screen' state shown while assets are being loaded (with a loading progress bar).
* __src/states/Game.js__ - An example interactive game state (i.e. level) that persists and animates.

* __assets/audio__ & __assets/images__ - Example audio and music as well as images and a spritesheet

# Tips for Project Success
- When searching for help and online resources, search specifically for *phaser-ce* rather than phaser to avoid confusion.
- Phaser can be engaged in many different ways. You will see two general approaches online: procedurally with mostly function calls and object oriented with classes.
  - You should search for and attempt the latter style! (object oriented with classes)
- Remember, you can and should use all ES6 features especially object oriented 'class' features

# Credits
This project was originally forked from the [phaser-es6-webpack](https://github.com/lean/phaser-es6-webpack) project and will be regularly synced with changes to that repo. It has been customized with more comments and examples that are relevant to the GDD 325 course.

Art assets and music come from the student game [The Great Tsunami Thief](https://mushroom-canopy.itch.io/tsunami-thief)
