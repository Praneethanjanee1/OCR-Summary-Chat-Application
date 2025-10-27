import { useState } from 'react';
import { ocrService } from '../services/ocrService';

interface OCRResult {
  text: string;
  summary: string;
}

const useOCR = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);

  const processImage = async (imageFile: File): Promise<OCRResult | null> => {
    if (!imageFile) {
      const errorMsg = 'No image file provided';
      setError(errorMsg);
      console.error(errorMsg);
      return null;
    }

    setLoading(true);
    setError(null);
    setImage(imageFile);

    try {
      console.log('Starting image processing...');
      const ocrResult = await ocrService.processImage(imageFile);
      console.log('Image processing completed:', ocrResult ? 'Success' : 'No result');
      
      if (ocrResult) {
        setResult(ocrResult);
        return ocrResult;
      } else {
        throw new Error('Failed to process image: No result returned');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || 
                         err.message || 
                         'Failed to process image. Please try again.';
      
      console.error('OCR Processing Error:', {
        error: err,
        message: errorMessage,
        stack: err.stack
      });
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return {
    image,
    text: result?.text || '',
    summary: result?.summary || '',
    loading,
    error,
    processImage,
    reset
  };
}

export { useOCR };