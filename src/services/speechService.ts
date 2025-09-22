import axios from '../utils/axiosConfig';

const SPEECH_API = '/speech/speech';

export const synthesizeSpeech = async (
    text: string, 
    languageCode: string, 
    voiceName: string = 'es-ES-Chirp3-HD-Fenrir', 
    audioEncoding: string = 'MP3'
    ) => {
    try {
      const payload = {
        text,
        language_code: languageCode,
        voice_name: voiceName,
        audio_encoding: audioEncoding,
      };
      const response = await axios.post(SPEECH_API, payload, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error en synthesizeSpeech:', error);
      throw error;
    }
};