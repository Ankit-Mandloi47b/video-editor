import initJson from './exampleApiPayload/example.json'
import initVidJson from './exampleApiPayload/exampleVideo.json'
import initTextJson from './exampleApiPayload/exampleText.json'

export const createJson = (video, textList) => {
    const InitJson = JSON.parse(JSON.stringify(initJson))
    const vidDuration = video.duration || 0

    // Original height and width of video
    const originalHeight = video.videoHeight
    const originalWidth = video.videoWidth

    // height and width of video which is displaying on screen
    const screenHeight = video.offsetHeight
    const screenWidth = video.offsetWidth

    InitJson.name = video.name || "Demo Name"
    InitJson.id = (Math.random() * 1000000) >> 0
    InitJson.style.real = {
      width: originalWidth,
      height: originalHeight,
    };

    InitJson.timeline.duration = vidDuration;

    // Video Porperties
    const InitVidJson = JSON.parse(JSON.stringify(initVidJson))
    InitVidJson._uid = 0
    InitVidJson.property.videoHeight = originalHeight
    InitVidJson.property.videoWidth = originalWidth

    //Video Timeline
    initJson.timeline.duration = vidDuration
    initJson.timeline.start = 0
    initJson.timeline.end = vidDuration
    initJson.timeline.originDuration = vidDuration

    //Video Style/Real
    initJson.style.real.height = originalHeight
    initJson.style.real.width = originalWidth
    // initJson.style.real.height = (originalHeight/screenHeight)*screenHeight
    // initJson.style.real.width = (originalWidth/screenWidth)*screenWidth


    //Video Style/relative
    initJson.style.relative.height = originalHeight/screenHeight
    initJson.style.relative.width = originalWidth/screenWidth

    const TextList = textList.map( Text => {
      const InitTextJson = JSON.parse(JSON.stringify(initTextJson))
      const {x:left, y:top, text, textDecoration, align: textAlign, background:highlightColor, fill:color, fontFamily, fontSize, fontStyle, height, width, dataId, from, to } = Text
      InitTextJson._uid = dataId

      // Text position original
      // InitTextJson.style.real.top = top
      // InitTextJson.style.real.left = left
      console.log('original=', originalHeight, 'showing=', screenHeight, 'top=', top, 'relative=', (originalHeight/screenHeight), 'fill r=', (originalHeight/screenHeight)*top, 'fullll', ((screenHeight/originalHeight)*top)+top  )
      
      InitTextJson.style.real.top = ((originalHeight/screenHeight)*top)
      InitTextJson.style.real.left = ((originalWidth/screenWidth)*left)

      // InitTextJson.style.real.top = ((screenHeight/originalHeight)*top)+top
      // InitTextJson.style.real.left = ((screenWidth/originalWidth)*left)+left

      InitTextJson.style.real.width = width
      InitTextJson.style.real.height = height

      // Timeline
      InitTextJson.timeline.start = from ?? 0
      InitTextJson.timeline.end = !to || to > vidDuration ? vidDuration : to

      return {...InitTextJson, text, textDecoration, textAlign, highlightColor, color, fontFamily, fontSize, fontStyle, height, width }
 
    } )

    InitJson.objects = [ InitVidJson, ...TextList ]
    return InitJson

}

export const createNewJson = (video, textList) => [...textList]

export const getFrames = async (video)=> {
    const frames = [];
    // const button = document.querySelector("button");
    // const select = document.querySelector("select");
    // const canvas = document.querySelector("canvas");
    // const ctx = canvas.getContext("2d");

    if (window.MediaStreamTrackProcessor) {
        
        const track = await getVideoTrack(video);
        const processor = new window.MediaStreamTrackProcessor(track);
        const reader = processor.readable.getReader();
        readChunk();
        
        function readChunk() {
          reader.read().then(async({ done, value }) => {
            if (value) {
              const bitmap = await createImageBitmap(value);
            //   const index = frames.length;
              frames.push(bitmap);
            //   select.append(new Option("Frame #" + (index + 1), index));
              value.close();
            }
            if ( !done ) {
              readChunk();
            } else {

            }
          });
        }
    console.log('frames', frames)

    } else {
      alert("your browser doesn't support this API yet");
    }


    async function getVideoTrack(video) {

      await video.play();
      const [track] = video.captureStream().getVideoTracks();
      video.onended = (evt) => track.stop();
      return track;
    }
}