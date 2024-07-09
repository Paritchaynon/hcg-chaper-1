class Game{
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sfx = new SFX({
            context: this.audioContext,
            src:{mp3:"quick_swish.mp3", webm:"quick_swish.webm"},
            loop: false
        });
        
        const btn1 = document.getElementById("playSndBtn");
        const game = this;
        btn1.addEventListener('click', function(){game.sfx.play();})
    }
}