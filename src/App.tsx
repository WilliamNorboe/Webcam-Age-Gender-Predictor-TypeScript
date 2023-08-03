import "./App.css";
import { useState } from "react";
import Face from "./face";

import Camera from "./camera";

function App() {
  const [photoTaken, setPhotoTaken] = useState<any>(false);

  const takeNewPhoto = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <h1>Webcam Age/Gender Predictor by William Norboe</h1>
      <Camera setState={setPhotoTaken} />
      <div>
        {photoTaken ? (
          <div>
            <button onClick={takeNewPhoto}>Take New Photo</button>
            <Face img={photoTaken} />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="example invisible"></div>
    </div>
  );
}

export default App;
