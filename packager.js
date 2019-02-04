// Import 3rd party packages
import path from 'path'
import NwBuilder from 'nw-builder'

// List of files to package (adjust as needed for your game)
let FILES = [
  path.resolve('package.json'),
  path.resolve('index.html'),
  path.resolve('./dist/*.js'),
  path.resolve('./assets/images/**/*'),
  path.resolve('./assets/fonts/**/*'),
  path.resolve('./assets/audio/sounds.ogg'),
  path.resolve('./assets/audio/sounds.json')
]

// Start the nw-builder configuration object
let NW_CONFIG = {
  files: FILES,
  buildDir: './packaged/',
  cacheDir: './node_modules/nw-builder/cache/',
  flavor: 'sdk'
}

// Customize for the current platform
switch (process.platform) {
  case 'win32':
    NW_CONFIG.platforms = [ 'win64' ]
    NW_CONFIG.winIco = path.resolve('./assets/images/icon.ico')
    break

  case 'darwin':
    NW_CONFIG.platforms = [ 'osx64' ]
    NW_CONFIG.macIcns = path.resolve('./assets/images/icon.icns')
    break

  default:
    console.error('Unsupported platform')
    process.exit(1)
}

// Make and setup the builder object
let nw = new NwBuilder(NW_CONFIG)
nw.on('log', console.log)

// Go ahead and build
nw.build().then(() => {
  console.log('all done!')
}).catch((error) => {
  console.error(error)
})
