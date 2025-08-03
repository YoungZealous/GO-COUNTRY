export class Game {
  constructor(ui, audioManager) {
    this.ui = ui
    this.audioManager = audioManager
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.score = 0
    this.startTime = null
    this.gameTime = 0
    this.gameTimer = null
    this.isGameActive = false
    
    // Country-themed symbols
    this.symbols = ['🤠', '🎸', '🐎', '🌾', '🚜', '🏜️', '⭐', '🎵']
  }

  start() {
    this.initializeGame()
    this.ui.addCardClickListener(this.handleCardClick.bind(this))
    this.startTimer()
    this.isGameActive = true
  }

  initializeGame() {
    this.cards = []
    this.flippedCards = []
    this.matchedPairs = 0
    this.moves = 0
    this.score = 1000
    this.gameTime = 0
    
    // Create pairs of cards
    const cardPairs = [...this.symbols, ...this.symbols]
    
    // Shuffle the cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }
    
    // Create card objects
    this.cards = cardPairs.map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false
    }))
    
    this.ui.createGameBoard(this.cards)
    this.updateUI()
  }

  handleCardClick(index) {
    if (!this.isGameActive) return
    
    const card = this.cards[index]
    
    // Don't allow clicking on already flipped or matched cards
    if (card.isFlipped || card.isMatched) return
    
    // Don't allow more than 2 cards to be flipped
    if (this.flippedCards.length >= 2) return
    
    // Flip the card
    card.isFlipped = true
    this.flippedCards.push(card)
    
    // Play flip sound
    this.audioManager.playFlip()
    
    // Update the display
    this.ui.createGameBoard(this.cards)
    
    // Check for match if 2 cards are flipped
    if (this.flippedCards.length === 2) {
      this.moves++
      this.score = Math.max(0, this.score - 10) // Decrease score with each move
      
      setTimeout(() => {
        this.checkForMatch()
      }, 1000)
    }
    
    this.updateUI()
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards
    
    if (card1.symbol === card2.symbol) {
      // It's a match!
      card1.isMatched = true
      card2.isMatched = true
      this.matchedPairs++
      this.score += 100 // Bonus for match
      
      // Play match sound
      this.audioManager.playMatch()
      
      // Check if game is won
      if (this.matchedPairs === this.symbols.length) {
        this.endGame()
      }
    } else {
      // Not a match, flip cards back
      card1.isFlipped = false
      card2.isFlipped = false
      
      // Play miss sound
      this.audioManager.playMiss()
    }
    
    this.flippedCards = []
    this.ui.createGameBoard(this.cards)
    this.updateUI()
  }

  startTimer() {
    this.startTime = Date.now()
    this.gameTimer = setInterval(() => {
      this.gameTime = Math.floor((Date.now() - this.startTime) / 1000)
      this.updateUI()
    }, 1000)
  }

  stopTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
  }

  endGame() {
    this.isGameActive = false
    this.stopTimer()
    
    // Calculate final score with time bonus
    const timeBonus = Math.max(0, 300 - this.gameTime) * 2
    this.score += timeBonus
    
    // Play win sound
    this.audioManager.playWin()
    
    // Show win screen
    const timeString = this.formatTime(this.gameTime)
    this.ui.showWinScreen(this.score, this.moves, timeString)
  }

  updateUI() {
    const timeString = this.formatTime(this.gameTime)
    this.ui.updateStats(this.score, this.moves, timeString)
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}