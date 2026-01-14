import { useRef, useState, useEffect } from "react";
import "./Camera.css";

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);

  // Start the camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream); // set state first
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Cannot access camera. Please check permissions.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  // Attach stream to video once it's ready
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    setImage(img);
    onCapture(img);

    stopCamera(); // stop camera after capture
  };

  // Retake photo
  const retakePhoto = () => {
    setImage(null);
    startCamera(); // restart camera
  };

  // Auto stop camera when leaving component
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className={`camera-box ${stream || image ? "open" : ""}`}>
      {/* Initial Open Camera button */}
      {!stream && !image && (
        <button type="button" className="camera-btn" onClick={startCamera}>
          Open Camera
        </button>
      )}

      {/* Live video and capture button */}
      {stream && !image && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <button type="button" className="capture-btn" onClick={capturePhoto}>
            Capture
          </button>
        </>
      )}

      {/* Preview image and retake button */}
      {image && (
        <>
          <img src={image} className="preview-img" alt="Captured" />
          <button type="button" className="retake-btn" onClick={retakePhoto}>
            Retake
          </button>
        </>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}

export default CameraCapture;
