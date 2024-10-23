import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner'; // Importing the QR scanner package

const ScanPage = () => {
  const videoRef = useRef(null); // Reference to the video element
  const [scanResult, setScanResult] = useState(null); // State to store the scanned result
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current, result => {
      setScanResult(result); // Update the scan result
      qrScanner.stop(); // Stop scanning after a successful scan
    });

    qrScanner.start() // Start the QR scanner
      .catch(err => {
        setError('Failed to start camera: ' + err.message); // Handle any errors
      });

    // Cleanup function to stop the scanner
    return () => {
      qrScanner.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display any error messages */}
      <div className="flex justify-center mb-4"> {/* Center the video element */}
        <video ref={videoRef} className="w-11/12 max-w-md h-auto border border-gray-300" />
      </div>
      {scanResult && (
        <div className="text-green-500 text-xl">
          <p>Success: {scanResult}</p> {/* Display the scanned result */}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
