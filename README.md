# GDD 325: 2D Web Game Base
#### A code base for student games developed in GDD 325 at UW Stout

# Quick Start
You should take time to read all the info below ... but if you want to get started quickly here's the TL;DR
- Install [node.js](https://nodejs.org/) LTS version (the even version, not the ODD one)
- Install [ffmpeg](https://ffmpeg.zeranoe.com/builds/) as follows
  - Download the archive from the link above
  - Go to the folder %LOCALAPPDATA% on your computer
  - Create a new folder 'ffmpeg' and unzip all contents into that folder
  - Add '%LOCALAPPDATA%\ffmpeg\bin' to your path (edit your account environment variables to do this)
- install git for windows and a code editor (I recommend VSCode)
- Open a bash window in the directory where you want to install the project
- Clone the repo with 'git clone URL .' (don't forget the period)
- In that same directory, ruyn npm install and then npm run sfx
- run npm run dev to start the game (it will automatically open in your default browser)

# Setup
Begin by downloading the latest release version form the 'releases' on GitHub. You may also fork or clone this repo however you will then have the entire revision history of THIS repo in addition to your own and this is not recommended.

Make sure you have downloaded and installed the *LTS version* of [node.js](https://nodejs.org/) then follow the instructions for setup starting from step 3 in the [original project](https://github.com/lean/phaser-es6-webpack) readme.

## Extra Options
This project has some extra things you can do with it out of the box compared to the original phaser-es6-webpack project:
* __Test your Deploy Build__ - Do 'npm run prod' to create a build that is identical to the deployment version but that still runs the browsersync server. This is handy for testing the deployment build.
* __Package for NWJS__ - Do 'npm run package' to create a standalone executable version of your game built using NWJS. Currently Windows and MacOS are supported (64bit only). It builds the executable that matches your current operating system.
* __NOTE:__ Unlike the original project, this one does not support cordova.

When you package to an executable the global variable `__NWJS__` will be set to true (normally set to false). You can use this to run different code when it is running in this mode (handling things like automatically entering fullscreen or adding a 'quit' option).

# Customization
You should imeadiately edit lines 2-5 in the package.json file with your team's and game's details. Do not put any of your personal details as this will be shared among the entire team.

You should also edit index.html and set the title to something meaningful for your game. Of course these details may change later in the semester so be sure to remember to keep them in sync.

Lastly, you shold edit THIS file! You can have a much simpler readme for your actual game (and include a link back to this project).

# Phaser 3
This project is now based on phaser 3 (NOT the 'community edition', sometimes called Phaser 2).  It was previously based on the CE edition but was recently updated as phaser 3 is quite mature and ready for prime-time!

# Project Structure
The various folders in the project directory all serve specific purposes. Please try to adhere to the conventions listed below when adding new files to your project so that things stay organized and it is easier to work concurrently without stepping on each other's toes.

The project folders are structured as follows:
* __src__ - All of your JavaScript code goes here.
* __src/states__ - JS code for the various game states (levels, menus, etc.)
* __src/sprites__ - JS code for each sprite (NOT the images/spritesheets)
* __assets__ - All data/assets go here (both binary and JSON encoded).
* __assets/audio__ - Audio data setup to be encoded to an audiosprite using the 'sfx' script.
* __assets/images__ - All images used as assets for sprites, backgrounds, UI, etc.

The following folders are managed by the tools and are automatically generated (therefore KEEP OUT):
* __dist__ - Babel/Webpack generated files will appear hear once you compile.
* __packaged__ - NW-Builder generated files will appear hear once you package your game as an exe.
* __node_modules__ - These are packages used by node (lots of JS libraries).

The initial project files are just a starting point and will change as you develop your game. You can add as many additional files as you like but please stick to the guidelines mentioned above for folders. You may also delete files you don't use BUT use caution doing this as you may find it useful later on.

The initial html/JavaScript files are structured as follows:
* __index.html__ - The entry point for your game from which all code is loaded and run.

* __src/main.js__ - The code starts here. All states should be loaded and the initial state activated.
* __src/config.js__ - Global code configuration constants belong here.
* __src/utils.js__ - Frequently used helper functions that are not part of any specific object belong here.

* __src/states/Boot.js__ - A 'bootstrap' state used to quickly pre-load assets needed for the loading splash screen (fonts, a loading image, sprites for a loading bar, loading music, etc.)
* __src/states/Splash.js__ - A 'splash screen' state shown while assets are being loaded (with a loading progress bar).
* __src/states/TestLevel.js__ - An example interactive game state (i.e. level) that persists and manages music, SFX, and player input.

* __src/sprites/Player.js__ - Example of a main-player sprite with animation and state management.

# Tips for Project Success
- This project deliberately inclues options to support use of VS Code. It is the recommended code editor.
- When searching for help and online resources, search specifically for *phaser-ce* rather than phaser to avoid confusion.
- Phaser can be engaged in many different ways. You will see two general approaches online: procedurally with mostly function calls and object oriented with classes.
  - You should search for and attempt the latter style! (object oriented with classes)
- Remember, you can and should use all ES6 features especially object oriented 'class' features.
- You can now bundle your game to an executable that uses NWJS with the 'package' script.

# Credits
This project was originally forked from the [phaser-es6-webpack](https://github.com/lean/phaser-es6-webpack) project and is occasionally synced with changes from that repo (by hand, not via a git merge). It has been customized with more comments and examples that are relevant to the GDD 325 course.

Art assets and music come from the student game [The Great Tsunami Thief](https://mushroom-canopy.itch.io/tsunami-thief) which was developed in a previous version of this course.
