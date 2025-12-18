"use client";

import { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";

export default function ScanUploadPage() {
  const [imgSrc, setImgSrc] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [linkDetected, setLinkDetected] = useState(false);

  const canvasRef = useRef();
  const fileInputRef = useRef();

  // Load saved image and QR data from localStorage and redraw canvas
  useEffect(() => {
    const savedImg = localStorage.getItem("qrImage");
    const savedData = localStorage.getItem("qrData");

    if (savedImg) {
      setImgSrc(savedImg);
      const img = new Image();
      img.src = savedImg;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // If QR data exists, decode again to draw bounding box
        if (savedData) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
            ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
            ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
            ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      };
    }

    if (savedData) {
      setQrData(savedData);
      setLinkDetected(savedData.startsWith("http"));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgSrcValue = event.target.result;
      setImgSrc(imgSrcValue);
      setQrData(null);
      setLinkDetected(false);

      // Save image to localStorage
      localStorage.setItem("qrImage", imgSrcValue);

      const img = new Image();
      img.src = imgSrcValue;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrData(code.data);
          setLinkDetected(code.data.startsWith("http"));

          // Save QR data to localStorage
          localStorage.setItem("qrData", code.data);

          // Draw bounding box
          ctx.strokeStyle = "red";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
          ctx.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
          ctx.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
          ctx.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
          ctx.closePath();
          ctx.stroke();
        } else {
          setQrData("No QR code detected.");
          setLinkDetected(false);
          localStorage.removeItem("qrData");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Upload & Scan QR Code</h1>

      <button
        onClick={() => fileInputRef.current.click()}
        className="mb-4 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
      >
        Upload a File
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />      

      <canvas
        ref={canvasRef}
        style={{ display: imgSrc ? "block" : "none", maxWidth: "100%", maxHeight: "400px" }}
      />

      {qrData && (
        <div className="mt-4 bg-white p-4 rounded shadow w-full max-w-md text-center">
          <p className="mb-2 break-all"><b>QR Data:</b> {qrData}</p>
          {linkDetected && (
            <a
              href={qrData}              
              rel="noopener noreferrer"
              className="text-white py-2 px-4 rounded bg-green-600 hover:bg-green-700 transition inline-block cursor-pointer"
            >
              Open Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}
