<script setup>
import { watch, ref, unref, toRaw, reactive, onMounted, computed  } from 'vue';


const props = defineProps(['src']),
      videoElementContainer = ref(''),
      videoElement = ref('');

watch(props, newSrc => {
    const rawNewSrc = toRaw(newSrc);

    unref(videoElement).setAttribute('src', rawNewSrc.src);
    unref(videoElementContainer).classList.add('animate__backInRight');
});

const videoElementContainerAnimationEndEvent = e => e.target.classList.add('blur-effect');


const playPauseBtn = ref(''),
      playPauseBtnState = ref(0),
      videoState = reactive({
            PLAY: 0,
            PAUSE: 1,
            RESTART: 2
      });

const playPauseVideoEvent = () => {
    (playPauseBtnState.value === toRaw(videoState).PAUSE)? unref(videoElement).pause() : unref(videoElement).play();
    playPauseBtnState.value = (playPauseBtnState.value === toRaw(videoState).PAUSE)? toRaw(videoState).PLAY : toRaw(videoState).PAUSE;
}

const videoEndedEvent = () => {
    playPauseBtnState.value = toRaw(videoState).RESTART;
}


const videoDuration = ref(''),
      currentTime = ref('');

let percentFilledNum = ref(0); 
const percentFilled = computed(() => {
    if(unref(percentFilledNum) > 100) return '100%';

    return `${unref(percentFilledNum)}%`;
});

let videoLength;

const convertTimeToStringFormat = time => {
    let hours   = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

    if(hours < 10)  hours   = '0' + hours;
    if(minutes < 10) minutes = '0' + minutes;
    if(seconds < 10) seconds = '0' + seconds;
    
    if(hours !== '00') return hours + ':' + minutes + ':' + seconds;

    return minutes + ':' + seconds;
}

const videoLoadedMetaDataEvent = e => {
    videoLength = e.target.duration;

    unref(videoDuration).innerText = convertTimeToStringFormat(e.target.duration);
};

const videoTimeUpdateEvent = e => {
    unref(currentTime).innerText = convertTimeToStringFormat(e.target.currentTime);

    percentFilledNum.value = e.target.currentTime / videoLength * 100;
};


const progressBar = ref('');

let mouseDown = false;

const mouseUpEvent = () => mouseDown = false;
const mouseDownEvent = () => mouseDown = true;

const mouseMoveEvent = e => {
    if(!mouseDown) return;

    progressBarClickEvent(e);
}

const progressBarClickEvent = e => {
    if(playPauseBtnState.value === toRaw(videoState).RESTART || e.target.classList.contains('progress-ball')) return;

    const progress = e.layerX,
          fullWidth = unref(progressBar).offsetWidth;

    let percent = progress / fullWidth;

    unref(videoElement).currentTime = percent * videoLength;

    percentFilledNum.value = percent * 100;
}

const mouseLeaveEvent = () => mouseDown = false;


const skipTime = 5;
// ^ Represents how many seconds of a video we are skipping

const forward = () => {
    const currentTime = unref(videoElement).currentTime,
          unrefVideoElement = unref(videoElement);
    
    unrefVideoElement.currentTime = (currentTime + skipTime > videoLength)? videoLength : currentTime + skipTime;
}

const backward = () => {
    const currentTime = unref(videoElement).currentTime,
          unrefVideoElement = unref(videoElement);    
    
    unrefVideoElement.currentTime = (currentTime - skipTime < 0)? 0 : currentTime - skipTime;
}

const keyEvents = e => {
    if(!unref(videoElementContainer).classList.contains('animate__backInRight')) return;

    switch(e.key) {
        case 'ArrowRight': 
            forward();
            break;
        
        case 'ArrowLeft':
            backward();
            break;

        case ' ':
            playPauseVideoEvent();
            break;
    }
}


const muted = ref(false),
      volumeControl = ref(''),
      audioControls = ref('');

const audioBtnClick = () => {
    unref(videoElement).volume = muted.value;
    unref(volumeControl).value = (muted.value)? '100' : '0';
    muted.value = !muted.value;
}

const volumeSliderChange = e => {
    const volume = Number(e.target.value) / 100;

    unref(videoElement).volume = volume;

    muted.value = (volume !== 0) ? false : true;
}

let tapedTwice = false,
    tap1, tap2;

const videoTouchEvent = e => {
    e.preventDefault();

    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout(() => tapedTwice = false, 300);
        tap1 = e.touches[0].clientX;
        playPauseVideoEvent();
        return;
    }

    tap2 = e.touches[0].clientX;

    const halfScreen = window.innerWidth / 2;

    if(tap1 >= halfScreen && tap2 >= halfScreen) forward();
    else if(tap1 <= halfScreen && tap2 <= halfScreen) backward();
}

onMounted(() => {
    window.addEventListener('keydown', keyEvents);

    if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        unref(audioControls).style.display = 'none';
        unref(videoElementContainer).classList.add('mobile');
    }
});

</script>

<template>
    <div class="video-player animate__animated" ref="videoElementContainer"
        @animationend="videoElementContainerAnimationEndEvent"
    >
        <video :src="src" ref="videoElement"
            @loadedmetadata="videoLoadedMetaDataEvent"
            @timeupdate="videoTimeUpdateEvent"
            @click="playPauseVideoEvent"
            @ended="videoEndedEvent"
            @touchstart="videoTouchEvent"
        ></video>

        <div class="controls">
            <div class="progress-bar" ref="progressBar"
                @mousemove="mouseMoveEvent"
                @mouseleave="mouseLeaveEvent"
                @mousedown="mouseDownEvent"
                @mouseup="mouseUpEvent"

                @click="progressBarClickEvent"
            >
                <div class="progress" :style="{ width: percentFilled }"></div>
                <div class="progress-ball" :style="{ left: percentFilled }" ref="progressBall"></div>
            </div>

            <div class="options">
                <button class="play-pause" ref="playPauseBtn"
                    @click="playPauseVideoEvent"
                >
                    <img v-if="playPauseBtnState === videoState.PAUSE" src="./../assets/pause-icon.png" alt="pause icon" draggable="false">
                    <img v-else-if="playPauseBtnState === videoState.PLAY" src="./../assets/play-icon.png" alt="play icon" draggable="false">
                    <img v-else-if="playPauseBtnState === videoState.RESTART" src="./../assets/restart-icon.png" alt="restart icon" draggable="false">
                </button>

                <div class="video-duration">
                    <p><span ref="currentTime">00:00</span> / <span ref="videoDuration">00:00</span></p>
                </div>

                <div class="audio-controls" ref="audioControls">
                    <button class="audio-img"
                        @click="audioBtnClick"
                    >
                        <img v-if="muted" src="./../assets/muted-icon.png" alt="muted icon">
                        <img v-else src="./../assets/sound-icon.png" alt="sound icon">
                    </button>
                    <input type="range" name="volumeControl" id="volumeControl" ref="volumeControl" min="0" max="100" value="100" step="1"
                        @input="volumeSliderChange"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .video-player {
        --animation-fill-mode: forwards;
        --animation-duration: 1s;

        width: min(80%, 800px);
        height: min(60%, auto);  /* Auto here so the video player can be the same height as the video */

        position: absolute;
        left: 100%;

        animation-fill-mode: var(--animation-fill-mode);
        animation-duration: var(--animation-duration);
    }

    .video-player.animate__backInRight {
        top: 50%;
        left: 50%;
        translate: -50% -50%;
    }

    .video-player.full-screen {
        top: 100%;
        left: 100%;
    }

    .video-player::before {
        --additional-size: 20px;
        --blur-size: blur(20px);

        content: '';
        width: calc(100% + var(--additional-size));
        height: calc(100% + var(--additional-size));

        position: absolute;
        top: calc(var(--additional-size) / -2);
        left: calc(var(--additional-size) / -2);

        z-index: -1;
    }

    .video-player.blur-effect::before {
        background-color: white;
        filter: var(--blur-size);
    }
    

    .video-player video {
        width: 100%;
        height: 100%;

        z-index: 1;
    }

    .controls {
        --progress-bar-width: 90%;
        --progress-bar-height: 8px;

        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: min(4rem, 25%);
        
        opacity: 0;
        
        transition: opacity .5s ease;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3px;

        user-select: none;
    }

    .video-player:hover .controls,
    .video-player.mobile .controls {
        opacity: 1;
    }

    .progress-bar {
        --progress-color: red;
        --progress-bar-bg-color: hsla(0, 100%, 100%, .8);

        width: var(--progress-bar-width);
        height: var(--progress-bar-height);

        position: relative;
        
        background-color: var(--progress-bar-bg-color);

        cursor: pointer;
    }

    .progress {
        width: 0%;
        /* ^ This indicates the progress */

        height: 100%;
        background-color: var(--progress-color);
    }

    .progress-ball {
        --progress-ball-width: 17px;
        --progress-ball-height: 17px;

        width: var(--progress-ball-width);
        height: var(--progress-ball-height);
        border-radius: 50%;

        background-color: var(--progress-color);

        position: absolute;
        top: calc(var(--progress-bar-height) / -2);
        left: 0%;
        /* ^ This indicates the progress */
        translate: -50%;

        opacity: 0;
        transition: opacity .5s;
    }

    .controls:hover .progress-ball {
        opacity: 1;
    }

    .options {
        width: 100%;
        height: 70%;
        
        padding: .4rem calc(50% - var(--progress-bar-width) / 2);
        /*                ^ Calculates the padding needed on the sides so it matches
                            the progress bar, it's supposed to be 100% of the width - whatever width the progress bar is
                            and then all of that divided by 2 so the padding is on both sides                    
        */

        display: flex;
        align-items: center;
        gap: 5px;
    }

    .play-pause {
        width: 5%;
        height: 100%;

        cursor: pointer;

        background: none;
        border: none;
    }

    .video-duration {
        color: white;
        font-weight: bolder;
        font-size: 2.5vmin;
    }

    .audio-controls {
        height: 100%;
        margin-left: .4rem;
        display: flex;
        align-items: center;
        gap: .7rem;
    }

    .audio-img {
        width: 20%;
        height: 100%;

        cursor: pointer;

        background: none;
        border: none;
    }

    .audio-controls input[type="range"] {
        accent-color: white;
        cursor: pointer;
    }
</style>