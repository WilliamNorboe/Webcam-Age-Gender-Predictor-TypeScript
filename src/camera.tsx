import React, { useEffect, useRef } from "react";
import "./App.css";

const Camera: React.FC<props> = ({ setState }) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const colorRef = useRef(null);

  let video: VideoObject = {}

  let playing = false;
  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    if(playing){
      return;
    }
    playing = true;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        video.video = videoRef.current;
        video.video.srcObject = stream;
        video.video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const paintToCanvas = () => {
    video.video = videoRef.current;
    video.photo = photoRef.current;
    let ctx = video.photo.getContext("2d");


    const width = 320;
    const height = 240;
    video.photo.width = width;
    video.photo.height = height;
    return setInterval(() => {
      video.color = colorRef.current;

      ctx.drawImage(video.video, 0, 0, width, height);
      let pixels = ctx.getImageData(0, 0, width, height);

      video.color.style.backgroundColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
        pixels.data[2]
      })`;
      video.color.style.borderColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
        pixels.data[2]
      })`;
    }, 200);
  };

  const takePhoto = () => {
    video.photo = photoRef.current;
    video.strip = stripRef.current;

    const data = video.photo.toDataURL("image/jpeg");

    stop();
    setState(data);
    const cam = document.querySelector('.container') as HTMLElement;
    cam.style.display = "none";
  };

  const stop = () => {
    if(!playing){
      return;
    }
    const stream = video.video.srcObject;
    const tracks = stream.getTracks();
  
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      track.stop();
    }
    playing = false;
    video.video.srcObject = null;
  }

  return (
    <div className="container">
      <div ref={colorRef} className="scene">
      </div>
      <div className="webcam-video">
        <div className="buttons">
            <button onClick={() => takePhoto()}>Take a photo</button>
            <button onClick={(e) => {stop()}}>Stop Feed</button>
            <button onClick={() => {getVideo()}}>Start Feed</button>
        </div>
        <video
          onCanPlay={() => paintToCanvas()}
          ref={videoRef}
          className="player"
        />
        <canvas ref={photoRef} className="photo" />
      </div>
    </div>
  );
}

interface VideoObject {
  [key: string]: any
}

type props = {
  setState: React.Dispatch<React.SetStateAction<any>>
};

export default Camera;