import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface OCRUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const OCRUpload: React.FC<OCRUploadProps> = ({ onUpload, isLoading }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setPreviewUrl(URL.createObjectURL(file));
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setShowCamera(false);
      alert('Could not access the camera. Please check your permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
            setPreviewUrl(URL.createObjectURL(blob));
            onUpload(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  if (showCamera) {
    return (
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
        <div className="aspect-video bg-black flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          {!videoRef.current?.srcObject && (
            <div className="text-center p-6 bg-black/50 rounded-xl text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">Initializing camera...</p>
              <p className="text-sm text-gray-300 mt-1">Please allow camera access when prompted</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
          <button
            onClick={stopCamera}
            className="bg-white/90 p-3 rounded-full shadow-xl hover:bg-white transition-all transform hover:scale-110"
            aria-label="Close camera"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={captureImage}
            className="bg-white/90 p-3 rounded-full shadow-xl hover:bg-white transition-all transform hover:scale-110"
            aria-label="Capture image"
          >
            <div className="w-14 h-14 bg-red-500 rounded-full border-4 border-white"></div>
          </button>
          <div className="w-14"></div> {/* Spacer for balance */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Image</h3>
            <p className="text-sm text-gray-500 mb-4">
              {isDragActive ? 'Drop the image here' : 'Drag & drop or click to browse'}
            </p>
            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              JPG, PNG (max 5MB)
            </div>
          </div>
        </div>

        <button
          onClick={startCamera}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-300 hover:bg-blue-50 flex flex-col items-center justify-center"
        >
          <div className="p-4 bg-green-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Take Photo</h3>
          <p className="text-sm text-gray-500">Use your camera to capture text</p>
        </button>
      </div>

      {previewUrl && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="rounded-lg border border-gray-200 w-full max-h-48 object-contain bg-gray-50 p-2"
            />
            <button
              onClick={() => {
                setPreviewUrl(null);
                if (onUpload) onUpload(new File([], '')); // Reset the upload
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center justify-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-700 font-medium">Processing your image...</span>
        </div>
      )}
    </div>
  );
};

export { OCRUpload };