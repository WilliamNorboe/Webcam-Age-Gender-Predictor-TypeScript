import './App.css';
import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";


function Face(props: { img: string; }) {
    const dimensionsElm = document.querySelector('.example') as HTMLElement;
    let dimensions = getComputedStyle(dimensionsElm);
    let width = Number(dimensions.width.split('p')[0]);
    let height = Number(dimensions.height.split('p')[0]);
    console.log(height);

    let photo: photoObject = {}
    photo.imgRef = useRef();
    photo.canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      photo.imgRef.current,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
      console.log(detections);
      photo.canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(photo.imgRef.current);
      faceapi.matchDimensions(photo.canvasRef.current, {
        width: width,
        height: height,
      })
      const resized = faceapi.resizeResults(detections, {
        width: width,
        height: height,
      });
      faceapi.draw.drawDetections(photo.canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(photo.canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(photo.canvasRef.current, resized);
      resized.forEach( detection => {
        const box = detection.detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
        drawBox.draw(photo.canvasRef.current)
      })
  
  }
  useEffect(()=>{
    const loadModels = () =>{
      Promise.all([
        faceapi.nets.tinyFaceDetector.load("/Webcam-Age-Gender-Predictor-TypeScript/models"),
        faceapi.nets.faceLandmark68Net.load("/Webcam-Age-Gender-Predictor-TypeScript/models"),
        faceapi.nets.faceRecognitionNet.load("/Webcam-Age-Gender-Predictor-TypeScript/models"),
        faceapi.nets.faceExpressionNet.load("/Webcam-Age-Gender-Predictor-TypeScript/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/Webcam-Age-Gender-Predictor-TypeScript/models"),
      ]).then(handleImage)
      .catch((e) => console.log(e));
    }
    photo.imgRef.current && loadModels()
  }, []);

  let timg = props.img;
  return (
    <div className="app">
      <img
      crossOrigin='anonymous'
      ref = {photo.imgRef}
      src = {timg}
      alt = "" className = "example"
      />
      <canvas ref = {photo.canvasRef}  /> 
    </div>
  );
}

interface photoObject {
    [key: string]: any
}


export default Face;
