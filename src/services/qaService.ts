import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/answers'; // Replace with the actual OpenAI API endpoint
const API_KEY = process.env.OPENAI_API_KEY; // Ensure your API key is stored in environment variables

export const qaService = {
    askQuestion: async (question: string, summary: string) => {
        try {
            const response = await axios.post(API_URL, {
                question,
                context: summary,
                model: 'text-davinci-003', // Specify the model you want to use
                max_tokens: 150, // Adjust the token limit as needed
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.answers[0]; // Return the first answer from the response
        } catch (error) {
            console.error('Error asking question:', error);
            throw error; // Rethrow the error for handling in the component
        }
    },
};