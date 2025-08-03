export class UI {
  constructor(startGameCallback) {
    this.startGameCallback = startGameCallback
    this.app = document.getElementById('app')
  }

  render() {
    this.app.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <h1 class="game-title">🤠 GO COUNTRY 🎸</h1>
          <p class="game-subtitle">Memory Match Game</p>
        </div>
        
        <div class="start-screen" id="startScreen">
          <div style="margin-bottom: 40px;">
            <p style="font-size: 1.5rem; color: var(--country-brown); margin-bottom: 20px; font-weight: 500;">
              🎵 Inspired by Young Zealous 🎵
            </p>
            <p style="font-size: 1.2rem; color: var(--country-red); margin-bottom: 30px;">
              Match the country-themed cards and test your memory!
            </p>
          </div>
          <button class="start-button" id="startButton">
            🚀 Start Playing! 🚀
          </button>
        </div>

        <div class="game-stats hidden" id="gameStats">
          <div class="stat-item">
            <div class="stat-label">Score</div>
            <div class="stat-value" id="score">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Moves</div>
            <div class="stat-value" id="moves">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Time</div>
            <div class="stat-value" id="time">0:00</div>
          </div>
        </div>

        <div class="game-board hidden" id="gameBoard"></div>

        <div class="game-controls hidden" id="gameControls">
          <button class="control-button" id="newGameButton">New Game</button>
          <button class="control-button" id="pauseButton">Pause</button>
        </div>
      </div>

      <div class="win-screen hidden" id="winScreen">
        <div class="win-content">
          <h2 class="win-title">🎉 Yeehaw! You Won! 🎉</h2>
          <p class="win-message" id="winMessage">Great job, partner!</p>
          <button class="start-button" id="playAgainButton">Play Again</button>
        </div>
      </div>
    `

    this.bindEvents()
  }

  bindEvents() {
    document.getElementById('startButton').addEventListener('click', () => {
      this.showGameScreen()
      this.startGameCallback()
    })

    document.getElementById('newGameButton').addEventListener('click', () => {
      this.startGameCallback()
    })

    document.getElementById('playAgainButton').addEventListener('click', () => {
      this.hideWinScreen()
      this.startGameCallback()
    })

    document.getElementById('pauseButton').addEventListener('click', () => {
      // Pause functionality can be implemented here
      console.log('Game paused')
    })
  }

  showGameScreen() {
    document.getElementById('startScreen').classList.add('hidden')
    document.getElementById('gameStats').classList.remove('hidden')
    document.getElementById('gameBoard').classList.remove('hidden')
    document.getElementById('gameControls').classList.remove('hidden')
  }

  hideGameScreen() {
    document.getElementById('gameStats').classList.add('hidden')
    document.getElementById('gameBoard').classList.add('hidden')
    document.getElementById('gameControls').classList.add('hidden')
  }

  showWinScreen(score, moves, time) {
    const winMessage = document.getElementById('winMessage')
    winMessage.textContent = `You completed the game in ${moves} moves and ${time}! Score: ${score}`
    document.getElementById('winScreen').classList.remove('hidden')
  }

  hideWinScreen() {
    document.getElementById('winScreen').classList.add('hidden')
  }

  updateStats(score, moves, time) {
    document.getElementById('score').textContent = score
    document.getElementById('moves').textContent = moves
    document.getElementById('time').textContent = time
  }

  createGameBoard(cards) {
    const gameBoard = document.getElementById('gameBoard')
    gameBoard.innerHTML = ''
    
    cards.forEach((card, index) => {
      const cardElement = document.createElement('div')
      cardElement.className = 'game-card'
      cardElement.dataset.index = index
      cardElement.innerHTML = card.isFlipped ? card.symbol : '🎪'
      
      if (card.isMatched) {
        cardElement.classList.add('matched')
      } else if (card.isFlipped) {
        cardElement.classList.add('flipped')
      }
      
      gameBoard.appendChild(cardElement)
    })
  }

  addCardClickListener(callback) {
    document.getElementById('gameBoard').addEventListener('click', (e) => {
      if (e.target.classList.contains('game-card')) {
        const index = parseInt(e.target.dataset.index)
        callback(index)
      }
    })
  }
}