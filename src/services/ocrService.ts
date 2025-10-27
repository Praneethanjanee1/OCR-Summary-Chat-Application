import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const ocrService = {
  async processImage(imageFile: File): Promise<{ text: string; summary: string }> {
    try {
      console.log('Processing image file:', imageFile);
      
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      console.log('Image converted to base64');
      
      // Extract text using GPT-4 Vision
      console.log('Extracting text with OpenAI...');
      const extractedText = await this.extractTextWithOpenAI(base64Image);
      console.log('Text extracted:', extractedText.substring(0, 100) + '...');
      
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the image.');
      }

      // Generate summary using the extracted text
      console.log('Generating summary...');
      const summary = await this.generateSummary(extractedText);
      console.log('Summary generated');
      
      return { 
        text: extractedText, 
        summary 
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to process image. Please try again.'
      );
    }
  },

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = error => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  },

  async extractTextWithOpenAI(base64Image: string): Promise<string> {
    try {
      // Remove the data URL prefix if present
      const base64Data = base64Image.split(',')[1] || base64Image;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Updated to the latest model
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract all text from this image. Preserve the formatting and structure as much as possible." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error extracting text with OpenAI:', error);
      throw new Error('Failed to extract text from image. Please try again.');
    }
  },

  async generateSummary(text: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4", // Updated to the latest model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text while preserving key information."
          },
          {
            role: "user",
            content: `Please summarize the following text concisely:
            
            ${text}
            
            Summary:`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || 'No summary available.';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Failed to generate summary. Please try again.';
    }
  },

  async askQuestion(question: string, context: string): Promise<string> {
    try {
      console.log('Sending question to OpenAI...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant that provides clear, concise answers based on the provided context. 
            
            Follow these guidelines:
            1. If the context contains the answer, provide a clear and helpful response.
            2. If the context is related but doesn't directly answer the question, provide a helpful response based on the available information.
            3. If the context is completely unrelated, politely explain that the document doesn't contain relevant information.
            4. If the question is unclear or too broad, ask for clarification.
            5. Be conversational and helpful in your responses.`
          },
          {
            role: "user",
            content: `Document Context: ${context}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      });

      let response = completion.choices[0]?.message?.content || "I'm not sure how to respond to that. Could you rephrase your question?";
      
      // If the response is very short or seems like an error, provide a more helpful message
      if (response.length < 20 || response.toLowerCase().includes('i cannot find') || response.toLowerCase().includes('no answer')) {
        return "I couldn't find a specific answer in the document. Could you provide more details or try rephrasing your question?";
      }
      
      return response;
    } catch (error) {
      console.error('Error asking question:', error);
      return 'Sorry, I encountered an error while processing your question.';
    }
  }
};

export default ocrService;