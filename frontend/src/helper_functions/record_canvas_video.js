import { uploadFile } from "../services/apis";

function record(canvas, time) {
    var recordedChunks = [];
    return new Promise(function (res, rej) {
        if (!canvas || !time) return rej('Canvas and Time both are required')
        try {
            var stream = canvas.captureStream(60 /*fps*/);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "video/webm; codecs=vp9"
            });

            //ondataavailable will fire in interval of `time || 4000 ms`
            mediaRecorder.start(time || 4000);

            mediaRecorder.ondataavailable = function (event) {
                recordedChunks.push(event.data);
                // after stop `dataavilable` event run one more time
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }

            }

            mediaRecorder.onstop = async function (event) {
                var blob = new Blob(recordedChunks, { type: "video/webm" });
                await uploadFile(blob)
                var url = URL.createObjectURL(blob);
                res(url);
            }
        }
        catch (error) {
            rej(error)
        }
    })
}


export const recordVideo = record