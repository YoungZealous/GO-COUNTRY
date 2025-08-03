import './style.css'
import { Game } from './game/Game.js'
import { UI } from './ui/UI.js'
import { AudioManager } from './audio/AudioManager.js'

class GoCountryApp {
  constructor() {
    this.game = null
    this.ui = null
    this.audioManager = new AudioManager()
    this.init()
  }

  init() {
    this.ui = new UI(this.startGame.bind(this))
    this.ui.render()
  }

  startGame() {
    this.game = new Game(this.ui, this.audioManager)
    this.game.start()
  }
}

// Initialize the app
new GoCountryApp()