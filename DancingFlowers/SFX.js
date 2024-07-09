class SFX{
    constructor(options) {
        this.context = options.context;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.setValueAtTime(1,this.context.currentTime);
        this.gainNode.connect(this.context.destination);
        this._loop = options.loop;
        this.buffer = null;
        
        let codec;
        for(let prop in options.src){
            if(prop=="webm" && SFX.supportsVideoType(prop)){
                codec = prop;
                break;
            }
            if (prop=="mp3"){
                codec = prop;
            }
        }
        
        if (codec!=undefined){
            this.url = options.src[codec];
            this.load(this.url);
        }else {
            console.warn("Browser does not support any of the supplied audio flies");
        }
    }
    
    static supportsVideoType(type) {
        let video;
        let formats = {
            ogg: 'video/ogg; codecs="theora"',
            h264: 'video/mp4; codecs="avc.142E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            vp9: 'video/webm; codecs="vp9"',
            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
        };
        
        if(!video) video = document.createElement('video');
        
        return video.canPlayType(formats[type] || type);
    }
    
    load(url) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType= "arraybuffer";
        
        const sfx = this;
        
        request.onload = function (){
            sfx.context.decodeAudioData(
                request.response,
                function (buffer){
                    if(!buffer){
                        console.error('error decoding file data: '+sfx.url);
                        return;
                    }
                    sfx.buffer=buffer;
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        }
        
        request.onerror = function () {
            console.error('SFX Loader: XHR error');
        }
        
        request.send();
    }
    
    play(){
        if (this.source!=undefined) this.source.stop();
        this.source = this.context.createBufferSource();
        this.source.loop = this._loop;
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        this.source.start(0);
    }
}