<template>
    <v-container grid-list-xl>
        <video ref="video" class="camera-stream"/>
        <div ref="overlay" id="overlay">Cargando... </div>
        <v-card>
            <v-card-actions class="justify-center">
                <v-btn class="take-picture-button" @click="capture" color="pink" dark fab>
                    <v-icon class="pa-3">camera</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import firebase from '../configFirebase.js'
import postDog from '../mixins/postDogs.js'

export default {
    data () {
        return {
            mediaStream: null
        }
    },
    mounted () {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(mediaStream => {
                this.mediaStream = mediaStream
                this.$refs.video.srcObject = mediaStream
                this.$refs.video.play()
            })
            .catch(error => console.error('getUserMedia() error:', error))
        }
        else if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia({ video: true }, function(mediaStream) {
                this.mediaStream = mediaStream
                this.$refs.video.srcObject = mediaStream;
                this.$refs.video.play()
            }, errBack);
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia({ video: true }, function(mediaStream){
                this.mediaStream = mediaStream
                this.$refs.video.srcObject = window.webkitURL.createObjectURL(mediaStream);
                this.$refs.video.play()
            }, errBack);
        } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
            navigator.mozGetUserMedia({ video: true }, function(mediaStream){
                this.mediaStream = mediaStream
                this.$refs.video.srcObject = window.URL.createObjectURL(mediaStream);
                this.$refs.video.play()
            }, errBack);
        }
    },
    methods: {
        capture () {
            const vm =this;
            const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            this.$refs.video.pause()
            this.$refs.overlay.style.display = 'block';
            return imageCapture.takePhoto().then(blob => {

                firebase.storage.ref().child(`images/picture-${new Date().getTime()}`).put(blob)
                    .then(res =>  {
                        res.ref.getDownloadURL().then((pictureUrl) => {
                            console.log("File available at", pictureUrl);
                            this.$router.push({
                                name: 'post',
                                params:{ pictureUrl }
                            })
                        });

                    })
                    .catch(err => {
                        this.$router.go(-1)
                    });
            })
        }
    },
    destroyed () {
        const tracks = this.mediaStream.getTracks()
        tracks.map(track => track.stop())
    }
}
</script>

<style scoped>

    .camera-stream {
        width: 100%;
        max-height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #overlay {
        position: absolute;
        color: #FFF;
        text-align: center;
        top:35%;
        justify-content: center;
        font-size: 20px;
        background-color: rgba(221, 221, 221, 0.3);
        width: 100%;
        z-index: 2147483647;
        display: none;
    }
</style>