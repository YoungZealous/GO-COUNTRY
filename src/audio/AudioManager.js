export class AudioManager {
  constructor() {
    this.audioContext = null
    this.sounds = {}
    this.isMuted = false
    this.initializeAudio()
  }

  initializeAudio() {
    try {
      // Create audio context on first user interaction
      document.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
          this.createSounds()
        }
      }, { once: true })
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  createSounds() {
    if (!this.audioContext) return

    // Create different sound effects using Web Audio API
    this.sounds = {
      flip: this.createTone(800, 0.1, 'sine'),
      match: this.createTone(1200, 0.3, 'triangle'),
      miss: this.createTone(300, 0.2, 'sawtooth'),
      win: this.createWinSound()
    }
  }

  createTone(frequency, duration, waveType = 'sine') {
    return () => {
      if (!this.audioContext || this.isMuted) return

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = waveType

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    }
  }

  createWinSound() {
    return () => {
      if (!this.audioContext || this.isMuted) return

      // Create a celebratory chord
      const frequencies = [523.25, 659.25, 783.99] // C, E, G
      const duration = 0.8

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator()
          const gainNode = this.audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(this.audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime)
          oscillator.type = 'triangle'

          gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

          oscillator.start(this.audioContext.currentTime)
          oscillator.stop(this.audioContext.currentTime + duration)
        }, index * 100)
      })
    }
  }

  playFlip() {
    if (this.sounds.flip) this.sounds.flip()
  }

  playMatch() {
    if (this.sounds.match) this.sounds.match()
  }

  playMiss() {
    if (this.sounds.miss) this.sounds.miss()
  }

  playWin() {
    if (this.sounds.win) this.sounds.win()
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }
}