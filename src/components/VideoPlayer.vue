<script setup>
import { watch, ref, unref, toRaw, onMounted  } from 'vue';

const props = defineProps(['src']);

const videoElementContainer = ref('');
const videoElement = ref('');

watch(props, newSrc => {
    const rawNewSrc = toRaw(newSrc),
          unrefVideoElement = unref(videoElement),
          unrefVideoElementContainer = unref(videoElementContainer);

    if(rawNewSrc.src.length !== 0) {
        unrefVideoElement.setAttribute('src', rawNewSrc.src);
        unrefVideoElementContainer.classList.add('animate__backInRight');
    }
});

const initVideoPlayerEvent = () => {
    const unrefVideoElementContainer = unref(videoElementContainer);

    unrefVideoElementContainer.addEventListener('animationend', () => {
        unrefVideoElementContainer.classList.add('blur-effect');
    });
};

onMounted(initVideoPlayerEvent);
</script>

<template>
    <div class="video-player animate__animated" ref="videoElementContainer">
        <video ref="videoElement"></video>
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

        transition: all .5s ease;
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
</style>