import { useRef, useState, useEffect } from "react";
import "./Camera.css";

/**
 * CameraCapture Component
 * Handles face verification through camera capture
 * Provides professional UI with error handling
 */
function CameraCapture({ onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Start camera stream
     * Requests user media access and handles errors
     */
    const startCamera = async () => {
        setError("");
        setIsLoading(true);
        
        try {
            // Request camera access with constraints
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user', // Front-facing camera
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            setStream(mediaStream);
        } catch (err) {
            console.error("Camera access error:", err);
            let errorMessage = "Cannot access camera. ";
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage += "Please allow camera permissions in your browser settings.";
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage += "No camera found. Please connect a camera device.";
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage += "Camera is being used by another application.";
            } else {
                errorMessage += "Please check your camera permissions and try again.";
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Stop camera stream and release resources
     */
    const stopCamera = () => {
        if (!stream) return;
        stream.getTracks().forEach(track => {
            track.stop();
        });
        setStream(null);
    };

    /**
     * Set up video element when stream is available
     */
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(err => {
                    console.error("Video play error:", err);
                    setError("Failed to start video. Please try again.");
                });
            };
        }
    }, [stream]);

    /**
     * Capture photo from video stream
     * Converts to base64 and calls onCapture callback
     */
    const capturePhoto = () => {
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            if (!video || !canvas) {
                setError("Camera not ready. Please try again.");
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);
            
            // Convert to base64 image
            const img = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG with quality
            setImage(img);
            onCapture(img);
            stopCamera();
        } catch (err) {
            console.error("Capture error:", err);
            setError("Failed to capture image. Please try again.");
        }
    };

    /**
     * Retake photo - clear current image and restart camera
     */
    const retakePhoto = () => {
        setImage(null);
        setError("");
        startCamera();
    };

    /**
     * Cleanup: Stop camera when component unmounts
     */
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className={`camera-box ${stream || image ? "open" : ""}`}>
            {!stream && !image && (
                <>
                    <button 
                        onClick={startCamera} 
                        className="camera-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Opening Camera..." : "Open Camera"}
                    </button>
                    {error && <div className="camera-error">{error}</div>}
                </>
            )}
            
            {stream && !image && (
                <>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline
                        className="camera-video" 
                    />
                    <div className="camera-controls">
                        <button onClick={capturePhoto} className="capture-btn">
                            Capture Photo
                        </button>
                        <button onClick={stopCamera} className="camera-btn">
                            Cancel
                        </button>
                    </div>
                    {error && <div className="camera-error">{error}</div>}
                </>
            )}
            
            {image && (
                <>
                    <img src={image} alt="Captured face" className="preview-img" />
                    <div className="camera-controls">
                        <button onClick={retakePhoto} className="retake-btn">
                            Retake
                        </button>
                        <button 
                            onClick={() => {
                                setImage(null);
                                onCapture(null);
                            }} 
                            className="camera-btn"
                        >
                            Remove
                        </button>
                    </div>
                </>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}

export default CameraCapture;
