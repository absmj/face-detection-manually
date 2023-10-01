const faceDetection = {
    faces: [],
    async detectFace(source, canvas, name = '') {
        const detect = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks()

        const detectionLandMarkSize = await faceapi.resizeResults(detect, {
            width: source.width,
            height: source.height
        })
        canvas.width = source.width
        canvas.height = source.height

        faceapi.draw.drawDetections(canvas.getContext('2d'), detectionLandMarkSize)

        return detect

    },
    async similarityFace(f1, f2) {
        return faceapi.utils.round(
            faceapi.euclideanDistance(f1, f2)
        );
    },
    async mount() {
        await faceapi.nets.tinyFaceDetector.loadFromUri()
        await faceapi.loadFaceRecognitionModel()
        await faceapi.loadFaceLandmarkModel()
        await faceapi.loadFaceExpressionModel()
    }
}