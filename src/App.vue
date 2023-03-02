<script setup>
import { ref, unref, onMounted } from 'vue';

const uploadBox = ref(null);
const uploadVideoFile = ref(null);
const uploadBoxText = ref(null);

onMounted(() => {
    const unrefUploadBox = unref(uploadBox),
          unrefUploadVideoFile = unref(uploadVideoFile),
          unrefUploadBoxText = unref(uploadBoxText),

          validVideoFormat = ['m4v', 'avi', 'mpg', 'mp4'],
          hoverClassName = 'hovered',
          animationName = 'animate__shakeX';

    const videoCheckSuccess = () => {
        console.log("Success");
    }

    const uploadedVideoCheck = () => {
        const fileExtension = unrefUploadVideoFile.files[0].name.split('.')[1];

        if(unrefUploadVideoFile.files.length !== 1) {
            unrefUploadBoxText.innerText = 'Too many files! Upload a video!';
            unrefUploadBox.classList.add(animationName);
        } else if(!validVideoFormat.includes(fileExtension)) {
            unrefUploadBoxText.innerText = 'Upload a video!';
            unrefUploadBox.classList.add(animationName);
        } else {
            videoCheckSuccess();
        }
    }

    unrefUploadBox.addEventListener('animationend', () => {
        unrefUploadBox.classList.remove(animationName);
    });

    unrefUploadBox.addEventListener('click', () => {
        unrefUploadVideoFile.click();
    });

    unrefUploadBox.addEventListener('dragover', e => {
        e.preventDefault();

        unrefUploadBox.classList.add(hoverClassName);
    });

    unrefUploadBox.addEventListener('dragleave', () => {
        unrefUploadBox.classList.remove(hoverClassName);
    });

    unrefUploadBox.addEventListener('drop', e => {
        e.preventDefault();

        unrefUploadBox.classList.remove(hoverClassName);
        unrefUploadVideoFile.files = e.dataTransfer.files;
        uploadedVideoCheck();
    });

    unrefUploadVideoFile.addEventListener('change', () => {
        uploadedVideoCheck();
    });
});

</script>

<template>
    <button class="upload-box animate__animated" ref="uploadBox">
        <h2 class="upload-box-text" ref="uploadBoxText">Upload Video Here</h2>
        <div class="upload-box-x">
            <div class="box"></div>
        </div>
        <input type="file" name="uploadVideoFile" id="uploadVideoFile" ref="uploadVideoFile" required>
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

    .upload-box:hover.upload-box::before,
    .upload-box.hovered.upload-box::before {
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