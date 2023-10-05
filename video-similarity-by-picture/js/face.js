const faceDetection = {
    refereredFace: null,
    comparedFace: null,
    results: [],

    async compare(face) {
        this.comparedFace = await this.detectFace(face)
    },


    /**
     * @param {any} result
     */
    set biometrics(result) {
        this.results.push(Number(result))
    },


    get avarageResult() {
        return (this.results.reduce((a, b) => (a + b)) / this.results.length).toFixed(2)
    },

    get similarity() {
        return faceapi.utils.round(
            faceapi.euclideanDistance(this.originalPicture.descriptor, this.comparedFace.descriptor)
        )
    },

    async detectFace(source) {
        const face = await faceapi.detectSingleFace(source,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptor();

        if (face) {
            const { x, y, width, height } = face.detection.box;
            this.renderFace(source, x, y, width, height);
        }

        return face
    },

    async renderFace(image, x, y, width, height) {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const context = canvas.getContext("2d")

        context?.drawImage(image, x, y, width, height, 0, 0, width, height)

        canvas.toBlob(blob => image.src = URL.createObjectURL(blob), "image/jpeg")
    },

    async mount(originalPicture) {
        await faceapi.nets.ssdMobilenetv1.loadFromUri();
        await faceapi.nets.tinyFaceDetector.loadFromUri();
        await faceapi.nets.faceLandmark68Net.loadFromUri();
        await faceapi.nets.faceRecognitionNet.loadFromUri();
        await faceapi.nets.faceExpressionNet.loadFromUri();
        this.originalPicture = await this.detectFace(originalPicture)
    }
}