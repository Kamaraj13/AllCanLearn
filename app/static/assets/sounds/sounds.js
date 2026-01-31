// AllCanLearn Sound Effects System
// Uses Web Audio API - no external files needed

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = localStorage.getItem('soundsEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.3');
        this.initAudioContext();
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTone(frequency, duration, type = 'sine', volume = null) {
        if (!this.enabled) return;
        
        const vol = volume !== null ? volume : this.volume;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(vol, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Button click sound
    click() {
        this.playTone(800, 0.05, 'sine', this.volume * 0.7);
        setTimeout(() => this.playTone(600, 0.05, 'sine', this.volume * 0.5), 30);
    }

    // Hover sound (subtle)
    hover() {
        this.playTone(1200, 0.08, 'sine', this.volume * 0.3);
    }

    // Success notification (3-tone)
    success() {
        this.playTone(523.25, 0.1, 'sine', this.volume);
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', this.volume), 100);
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', this.volume), 200);
    }

    // Error sound
    error() {
        this.playTone(300, 0.1, 'sawtooth', this.volume);
        setTimeout(() => this.playTone(250, 0.15, 'sawtooth', this.volume), 100);
    }

    // Notification ping
    notification() {
        this.playTone(880, 0.08, 'sine', this.volume * 0.8);
        setTimeout(() => this.playTone(1046.5, 0.12, 'sine', this.volume * 0.8), 80);
    }

    // Toggle switch
    toggle() {
        this.playTone(1000, 0.05, 'square', this.volume * 0.5);
    }

    // Pop/drop sound
    pop() {
        if (!this.enabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.volume * 1.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Whoosh sound
    whoosh() {
        if (!this.enabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1500, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(this.volume * 0.7, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Tab switch
    tabSwitch() {
        this.playTone(700, 0.06, 'triangle', this.volume * 0.4);
    }

    // Modal open
    modalOpen() {
        this.playTone(600, 0.08, 'sine', this.volume * 0.5);
        setTimeout(() => this.playTone(900, 0.12, 'sine', this.volume * 0.5), 60);
    }

    // Modal close
    modalClose() {
        this.playTone(900, 0.08, 'sine', this.volume * 0.5);
        setTimeout(() => this.playTone(600, 0.12, 'sine', this.volume * 0.5), 60);
    }

    // Enable/disable sounds
    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('soundsEnabled', enabled);
        if (enabled) {
            this.click(); // Play confirmation sound
        }
    }

    // Set volume (0.0 to 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('soundVolume', this.volume);
    }

    // Toggle sounds on/off
    toggleEnabled() {
        this.setEnabled(!this.enabled);
        return this.enabled;
    }
}

// Initialize global sound effects instance
const sounds = new SoundEffects();

// Auto-attach click sounds to common elements when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Add click sounds to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => sounds.click());
    });

    // Add hover sounds to interactive elements (optional - can be removed if annoying)
    // document.querySelectorAll('button, a.btn, .card').forEach(element => {
    //     element.addEventListener('mouseenter', () => sounds.hover());
    // });

    // Add sounds to navigation tabs
    document.querySelectorAll('.nav-btn, .tab-btn').forEach(tab => {
        tab.addEventListener('click', () => sounds.tabSwitch());
    });

    // Add pop sound to dropdown/accordion elements
    document.querySelectorAll('select, details, .dropdown').forEach(element => {
        element.addEventListener('click', () => sounds.pop());
    });

    // Add success sound to submit buttons
    document.querySelectorAll('button[type="submit"], .submit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Play success sound after a short delay (simulating successful action)
            setTimeout(() => sounds.success(), 500);
        });
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundEffects;
}
