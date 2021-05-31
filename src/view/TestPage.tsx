import React, { useState } from "react";
import cv from "@techstark/opencv-js";

// window.cv = cv;

export default function TestPage() {

  const inputRef = React.createRef();
  const outputRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  const [imgUrl, setimgUrl] = useState("")

  let streaming = false
  const imageChange = (e: any) => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setimgUrl(url)
    }
  }

  const processing = (e: any) => {
    const src = cv.imread(e.target);
    const dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_BGR2GRAY);
    cv.imshow((outputRef as any).current, dst);
    src.delete();
    dst.delete();
  }
  const videoOn = () => {
    let video: HTMLVideoElement = document.getElementById("videoplay") as HTMLVideoElement; // video is the id of video tag
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log("An error occurred! " + err);
      });
  }

  const convertGray = () => {
    if (streaming) {
      streaming = false
      return
    }
    let video: HTMLVideoElement = document.getElementById('videoplay') as HTMLVideoElement
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;
    function processVideo() {
        try {
            if (!streaming) {
                // clean and stop.
                src.delete();
                dst.delete();
                return;
            }
            let begin = Date.now();
            // start processing.
            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow('canvasOutput', dst);
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);

        } catch (err) {
          console.log("error", err)
            // utils.printError(err);
        }
    };

    // schedule the first one.
    streaming = true
    setTimeout(processVideo, 0);
    console.log("processVideo start")
  }

  const takePickture = () => {
    let video: HTMLVideoElement = document.getElementById('videoplay') as HTMLVideoElement
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    cap.read(src);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('originOutput', src);
    cv.imshow('canvasOutput', dst);
    src.delete()
    dst.delete()
  }

  return (
    <div>
      <button onClick={videoOn} >Video On </button>
      <video id="videoplay" width='100' height="100"></video>

      <button onClick={convertGray}>ToGray</button>
      <button onClick={takePickture}>takePickture</button>

      <div>
        Select an image file as input{" "}
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={imageChange}
        />
      </div>

      <div className="input-image">
        {imgUrl && (
          <img
            alt="Select a file"
            src={imgUrl}
            onLoad={processing}
          />
        )}
      </div>

      <div className="output-image">
        <canvas ref={outputRef} />
      </div>
      <canvas id='originOutput'/>
      <canvas id='canvasOutput'/>

    </div>
  );

}

