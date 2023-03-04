<script setup>
import UploadBox from './components/UploadBox.vue';
import VideoPlayer from './components/VideoPlayer.vue';
import { ref } from 'vue';

let src = ref('');

const handleVideoSrc = e => src.value = e;
</script>

<template>
    <UploadBox @video-src="handleVideoSrc"/>
    <VideoPlayer :src="src"/>
</template>

<style scoped>

</style>