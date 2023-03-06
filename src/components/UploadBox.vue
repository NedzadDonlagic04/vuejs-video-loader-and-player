<script setup>
import { ref, unref } from 'vue';

const uploadBox = ref(''),
      uploadVideoFile = ref(''),
      uploadBoxText = ref(''),
      
      videoSrcEmit = defineEmits(['videoSrc']),
      
      validVideoFormat = ['m4v', 'avi', 'mpg', 'mp4'],
      hoverClassName = 'hovered',
      errorAnimationName = 'animate__shakeX',
      moveLeftAnimationName = 'animate__backOutLeft';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

/* 
    Function that converts video to base64 by calling
    the previously defined function
*/
const convertVideoToBase64 = async () => {
    try {
        const result = await toBase64(unref(uploadVideoFile).files[0]);
        videoSrcEmit('videoSrc', result);
        unref(uploadBox).classList.add(moveLeftAnimationName);
        unref(uploadBox).blur();
    } catch(error) {
        console.error(error);
    }
}

/* 
    Function used to check is the uploaded video
    following certain guidelines, those are:
    - that only a single file is uploaded
    - that the single file is a video
*/
const uploadedVideoCheck = () => {
    const unrefUploadVideoFile = unref(uploadVideoFile),
          unrefUploadBoxText = unref(uploadBoxText),
          unrefUploadBox = unref(uploadBox);

    const fileExtension = unrefUploadVideoFile.files[0].name.split('.').slice(-1)[0];

    if(unrefUploadVideoFile.files.length !== 1) {
        unrefUploadBoxText.innerText = 'Too many files! Upload a video!';
        unrefUploadBox.classList.add(errorAnimationName);
    } else if(!validVideoFormat.includes(fileExtension)) {
        unrefUploadBoxText.innerText = 'Upload a video!';
        unrefUploadBox.classList.add(errorAnimationName);
    } else {
        convertVideoToBase64();
    }
}

const uploadBoxDropEvent = e => {
    e.preventDefault();

    unref(uploadBox).classList.remove(hoverClassName);
    unref(uploadVideoFile).files = e.dataTransfer.files;
    uploadedVideoCheck();
}

const uploadBoxClickEvent = () => unref(uploadVideoFile).click();


const uploadBoxAnimationEndEvent = e => e.target.classList.remove(errorAnimationName);

const uploadBoxDragOverEvent = e => {
    e.preventDefault();

    unref(uploadBox).classList.add(hoverClassName);
}

const uploadBoxDragLeaveEvent = () => unref(uploadBox).classList.remove(hoverClassName);
</script>

<template>
    <button class="upload-box animate__animated" ref="uploadBox"
        @click="uploadBoxClickEvent"
        @animationend="uploadBoxAnimationEndEvent"
        @dragover="uploadBoxDragOverEvent"
        @dragleave="uploadBoxDragLeaveEvent"
        @drop="uploadBoxDropEvent"
    >
        <h2 class="upload-box-text" ref="uploadBoxText">Upload Video Here</h2>
        <div class="upload-box-x">
            <div class="box"></div>
        </div>
        <input type="file" name="uploadVideoFile" id="uploadVideoFile" ref="uploadVideoFile" required
            @change="uploadedVideoCheck"    
        >
    </button>
</template>

<style scoped>
    .upload-box {
        /* 
            Variable used to control the width of:
            - the upload box
            - the box with the + inside
            - the lines making up the +
        */
        --additional-size: 2px;
        --animation-duration: 1s;

        width: min(60%, 600px);
        height: min(40%, 400px);

        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;

        background: none;

        cursor: pointer;

        animation-duration: var(--animation-duration);  
    }
    
    .upload-box::before {
        --blur-size: blur(20px);

        content: '';
        width: calc(100% + var(--additional-size));
        height: calc(100% + var(--additional-size));

        position: absolute;
        top: calc(var(--additional-size) / -2);
        left: calc(var(--additional-size) / -2);

        background-color: white;

        z-index: 0;

        transition: filter .5s ease;
    }

    .upload-box:hover::before,
    .upload-box.hovered::before {
        filter: var(--blur-size);
    }

    .upload-box-text {
        color: white;
        font-size: 4vmin;
        width: 100%;

        position: absolute;
        top: 15%;
        left: 50%;
        translate: -50% -20%;

        z-index: 2;
    }

    .upload-box-x {
        width: 100%;
        height: 100%;

        position: absolute;
        inset: 0;

        background-color: var(--app-bg-color);

        z-index: 1;
    }

    .box {
        width: 50%;
        height: 50%;

        position: absolute;
        top: 70%;
        left: 50%;
        translate: -50% -70%;

        border: 4px dashed white;

        transition: border-style 1s ease;
    }

    .upload-box:hover .box,
    .upload-box.hovered .box {
        border-style: solid;
    }

    .box::before,
    .box::after {
        content: '';

        width: 30%;

        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;

        border: var(--additional-size) solid white;
    }

    .box::after {
        top: 48%;
        rotate: 90deg;
    }

    #uploadVideoFile {
        position: absolute;
        inset: 0;

        pointer-events: none;
        visibility: hidden;
    }
</style>