import React, { useEffect } from 'react'
import { RotatingTriangle } from '../assets/svg';


const Svg = <svg
    id='mysvg'
    width="120"
    height="120"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,30 90,90 30,90">
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 70"
            to="360 60 70"
            dur="10s"
            repeatCount="indefinite" />
    </polygon>
</svg>

// export default function SvgToVideo() {

//     useEffect(() => {
//         const svg = document.getElementById('mysvg')
//         const canv = document.querySelector('#rendered')
//         const ctx = canv.getContext('2d');


//         //Prepare a canvas on which to render the frames for our video
//         canv.width = 150;
//         canv.height = 150;
//         const recorder = canvasRecorder(canv, url => {

//             const video = document.body.appendChild(document.createElement('video'));

//             video.src = url;
//             video.controls = true;
//             video.autoplay = true;
//         });


//         //Find all animated elements, and save their original animation-delay:
//         var animed = Array.from(document.querySelectorAll('*')).filter(x => x.style.animationName);
//         animed.forEach(x => {
//             var css = x.style,
//                 anim = css.animationName,
//                 delay = css.animationDelay;

//             //console.log(x.id, anim, delay);
//             x.__originalDelay = delay.match(/\d/) ? delay : '0s';
//         });


//         //Loop through all animated elements, and update their animation-delay.
//         //Together with "animation-play-state: paused", this freezes the animation at the specified time.
//         function freeze(time) {
//             animed.forEach(x => {
//                 x.style.animationPlayState = 'paused';
//                 x.style.animationDelay = `calc(${x.__originalDelay} - ${time}ms)`;
//             });
//         }


//         function render(time, callback) {
//             freeze(time);
//             svg2canvas(svg, ctx, callback);
//         }


//         (function renderLoop(t) {
//             if (!t) {
//                 recorder.start();
//             }
//             //The complete animation lasts around 10 seconds:
//             if (t > 10000) {
//                 recorder.stop();
//                 return;
//             }

//             render(t || 0, () => requestAnimationFrame(renderLoop));
//         })();

//         /* Utils */

//         function svg2canvas(svg, ctx, callback) {
//             const img = new Image(),
//                 serialized = new XMLSerializer().serializeToString(svg),
//                 url = URL.createObjectURL(new Blob([serialized], { type: "image/svg+xml" }));

//             img.onload = function () {
//                 ctx.drawImage(img, 0, 0);
//                 callback();
//             };
//             img.src = url;
//         }

//         function canvasRecorder(canvas, callback) {
//             const chunks = [],
//                 stream = canvas.captureStream(),
//                 recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

//             recorder.ondataavailable = function (e) {
//                 const blob = e.data;
//                 if (blob && blob.size) { chunks.push(blob); }
//             };

//             recorder.onstop = (e) => {
//                 //console.log('stop', e);
//                 const url = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
//                 callback(url);
//             };

//             return recorder;
//         }
//     }, [])


//     return (
//         <>
//             {Svg}
//             <canvas id='rendered' ></canvas>
//         </>
//     )
// }


export default function SvgToVideoUsingJs() {
    const js = `
    <svg
    id='Content-R'
    width="120"
    height="120"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg">
    <polygon points="60,30 90,90 30,90">
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 70"
            to="360 60 70"
            dur="10s"
            repeatCount="indefinite" />
    </polygon>
</svg>
    <canvas id="rendered"></canvas>
    <script>
    const svg = document.querySelector('#Content-R'),
          canv = document.querySelector('#rendered'),
          ctx = canv.getContext('2d');
    
    
    //Prepare a canvas on which to render the frames for our video
    console.log(svg, svg?.clientWidth, svg?.width);
    canv.width = svg?.clientWidth;
    canv.height = svg?.clientHeight;
    const recorder = canvasRecorder(canv, url => {
    
        const video = document.body.appendChild(document.createElement('video'));
    
        video.src = url;
        video.controls = true;
        video.autoplay = true;
    });
    
    
    //Find all animated elements, and save their original animation-delay:
    var animed = Array.from(document.querySelectorAll('*')).filter(x => x.style.animationName);
    animed.forEach(x => {
        var css = x.style,
            anim = css.animationName,
            delay = css.animationDelay;
    
        //console.log(x.id, anim, delay);
        x.__originalDelay = delay.match(/\d/) ? delay : '0s';
    });
    
    
    //Loop through all animated elements, and update their animation-delay.
    //Together with "animation-play-state: paused", this freezes the animation at the specified time.
    function freeze(time) {
        animed.forEach(x => {
            x.style.animationPlayState = 'paused';
            // x.style.animationDelay = calc(x.__originalDelay - time ms);
        });
    }
    
    
    function render(time, callback) {
        freeze(time);
        svg2canvas(svg, ctx, callback);
    }
    
    
    (function renderLoop(t) {
        if (!t) {
            recorder.start();
        }
        //The complete animation lasts around 10 seconds:
        if (t > 10000) {
            recorder.stop();
            return;
        }
    
        render(t || 0, () => requestAnimationFrame(renderLoop));
    })();
    
    //const freezer = document.querySelector('#freezer');
    //freezer.oninput = (e) => freeze(freezer.value * 1000);
    //freezer.oninput();
    
    
    
    /* Utils */
    
    function svg2canvas(svg, ctx, callback) {
        const img = new Image(),
              serialized = new XMLSerializer().serializeToString(svg),
              url = URL.createObjectURL(new Blob([serialized], { type: "image/svg+xml" }));
    
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            callback();
        };
        img.src = url;
    }
    
    function canvasRecorder(canvas, callback) {
        const chunks = [],
              stream = canvas.captureStream(),
              recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    
        recorder.ondataavailable = function(e) {
            const blob = e.data;
            if (blob && blob.size) { chunks.push(blob); }
        };
    
        recorder.onstop = (e) => {
            //console.log('stop', e);
            const url = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
            callback(url);
        };
    
        return recorder;
    }
    </script>
    `
  return (<iframe srcDoc={js} /> )
}
