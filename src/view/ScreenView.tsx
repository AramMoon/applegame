import React from 'react'
import { useState } from 'react';
import TFUtil from '../util/TFUtil'

class Box {
  x: number
  y: number
  d: number

  constructor(x: number, y: number, d: number) {
    this.x = x
    this.y = y
    this.d = d
  }
}
export default function ScreenView() {

  const outputRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  const [imgUrl, setimgUrl] = useState("")

  const imageChange = (e: any) => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setimgUrl(url)
    }
  }

  const processing = (e: any) => {
    console.log("processing Start", e.target.src)
    console.log("Start Image")
    const image = new Image();
    image.src = e.target.src

    image.onload = async () => {
      var canvas = outputRef.current as HTMLCanvasElement//document.createElement('canvas');
      var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      boxingCanvas(canvas)
      processingCanvas(canvas)
    }
  }

  const get10Box = (map: number[][]) => {
    let boxs = []
    for (let y = 0; y < (map.length - 1); y++) {
      for (let x = 0; x < (map[y].length - 1); x++) {
        const x1 = map[y][x]
        const x2 = map[y][x + 1]
        const x3 = map[y + 1][x + 1]
        const x4 = map[y + 1][x]

        if (x1 + x2 === 10) {
          let box = new Box(x, y, 1)
          boxs.push(box)
        } else if (x1 + x2 + x3 + x4 === 10) {
          let box = new Box(x, y, 2)
          boxs.push(box)
        } else if (x1 + x4 === 10) {
          let box = new Box(x, y, 3)
          boxs.push(box)
        }
      }
    }
    return boxs
  }

  const boxingCanvas = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    console.log(canvas.width, canvas.width)
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let data = imageData.data
    const cx =  canvas.width / 2
    const cy = canvas.height / 2
    let xlen = 0
    let ylen = 0
    let xs = 0
    let xe = canvas.width
    let ys = 0
    let ye = canvas.height
    for(let x = 0 ; x < canvas.width; x++) {
      let po = (x + cy * canvas.width) * 4
      let r = data[po]
      let g = data[po + 1]
      let b = data[po + 2]
      // console.log(r,g,b)
      if (r === 16 && g === 232 && b === 103) {
        if (xs > 0) {
          if (xe === canvas.width) {
            xe = x - xlen * 1.8
          }
        }else {
          xlen += 1
        }
      }else if(xlen > 0) {
        if (xs > 0) {

        }else{
          xs = x + xlen * 1.4
        }
      }
    }


    for(let y = 0 ; y < canvas.height; y++) {
      let po = (cx + y * canvas.width) * 4
      let r = data[po]
      let g = data[po + 1]
      let b = data[po + 2]
      // console.log(r,g,b)
      if (r === 16 && g === 232 && b === 103) {
        data[po] = 0
        data[po + 1] = 0
        data[po + 2] = 0

        if (ys > 0) {
          if (ye === canvas.height) {
            ye = y - ylen * 3
          }
        }else {
          ylen += 1
        }
      }else if(ylen > 0) {
        if (ys > 0) {

        }else{
          ys = y + ylen * 3
        }
      }
    }


    console.log("StartX", xs, "EndX", xe)
    console.log("StartY", ys, "EndY", ye)
    let ww = xe-xs
    let hh = ye-ys

    let cropImageData = ctx.getImageData(xs, ys, ww, hh)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = ww
    tempCanvas.height = hh

    canvas.width = 50 * 17
    canvas.height =  500
    ctx.putImageData(cropImageData, 0, 0, 0, 0, 50 * 17, 500)
  }

  const processingCanvas = async (canvas: HTMLCanvasElement) => {
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    var data = imageData.data;
    console.log("image size", canvas.width, canvas.height)

    const xx = 17
    const yy = 10
    const w = canvas.width / xx
    const h = canvas.height / yy
    const dx = 0
    const dy = 0
    let map = []
    console.log("Cell size", w, h)
    for (let j = 0; j < yy; j++) {
      let submap = []
      for (let i = 0; i < xx; i++) {
        const x = i * w + dx
        const y = j * h + dy
        // White Count
        let whiteCount = 0
        let tfData49_50 = []
        for (let iy = y; iy < y + h; iy++) {
          for (let ix = x; ix < x + w; ix++) {
            let po = (ix + iy * canvas.width) * 4
            let r = data[po]
            let g = data[po + 1]
            let b = data[po + 2]
            if (r > 220 && g > 210  && b > 210 && g - b < 10 ) {
            // if (r > 240 && g > 240  && b > 240 && g - b < 10 ) {
              // if (r > 220 && g > 210  && b > 210 ) {
              whiteCount += 1
              tfData49_50.push(1)
              data[po] = 0
              data[po + 1] = 0
              data[po + 2] = 0
            }else{
              tfData49_50.push(0)
              data[po] = 255
              data[po + 1] = 255
              data[po + 2] = 255
            }

            // if (i === 1 && j === 3) {
            //   data[po] = 0
            //   data[po + 1] = 0
            //   data[po + 2] = 0
            // }
          }
        }
        // ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height)
        // console.log(i,j, whiteCount)
        // whiteCount = await TFUtil.predictNumber(tfData49_50)
        submap.push(whiteCount)
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.font = '20px Gulim';
        ctx.fillStyle = "black"
        ctx.fillText("" + whiteCount, x, y + 20)
        // ctx.fillText( "" + i +","  + j, x, y)
      }

      map.push(submap)
    }
    console.log(map)
    let boxs = get10Box(map)
    console.log(boxs)
    boxs.forEach(box => {
      const x = box.x * w + dx
      const y = box.y * h + dy
      let ww = w
      let hh = w
      if (box.d === 1) {
        ww += w
        ctx.strokeStyle = "#ff0000";
      } else if (box.d === 2) {
        ww += w
        hh += h
        ctx.strokeStyle = "#00ff00";
      } else if (box.d === 3) {
        hh += h
        ctx.strokeStyle = "#0000ff";
      }
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 5, y + 5, ww - 10, hh - 10)
    });
  }

  const start = async () => {
    const displayMediaOptions = {
      video: {
        cursor: "never"
      },
      audio: false
    };

    try {
      let captureStream = await (navigator.mediaDevices as any).getDisplayMedia(displayMediaOptions);
      const mainVideio = document.getElementById("videoout") as HTMLVideoElement
      mainVideio.srcObject = captureStream
      console.log("Capture Video", mainVideio.width, mainVideio.height)
    } catch (err) {
      console.error("Error: " + err);
      return
    }

  }

  const scan = async () => {
    const mainVideio = document.getElementById("videoout") as HTMLVideoElement
    const canvas = outputRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mainVideio, 0, 0);
    console.log("canvas Size", canvas.width, canvas.height)
    console.log("Video Size", mainVideio.width, mainVideio.height)
    await boxingCanvas(canvas)
    await processingCanvas(canvas) // 
  }

  const stop = () => {
    const mainVideio = document.getElementById("videoout") as HTMLVideoElement
    let tracks = (mainVideio.srcObject as any).getTracks();
    tracks.forEach((track: { stop: () => any; }) => track.stop());
    mainVideio.srcObject = null;
  }

  return (
    <div>
      <div>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={imageChange}
        />
      </div>

      <div className="input-image" hidden={true}>
        {imgUrl && (
          <img
            alt="Select a file"
            src={imgUrl}
            onLoad={processing}
          />
        )}
      </div>
      <button onClick={start}>start</button>
      <button onClick={scan}>scan</button>
      <button onClick={stop}>stop</button>

      <div className="output-image">
        <canvas ref={outputRef} width='1500' height='600' />
      </div>

      <video id="videoout" autoPlay></video>
    </div>
  )
}
