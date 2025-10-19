// Voice recording utilities using Web Speech API
export class VoiceRecorder {
  private recognition: any = null;
  private isSupported: boolean = false;
  private onResult: (text: string) => void = () => {};
  private onError: (error: string) => void = () => {};
  private onStart: () => void = () => {};
  private onEnd: () => void = () => {};

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('🎤 Speech Recognition not supported in this browser');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US'; // Default, can be changed later
    this.recognition.maxAlternatives = 1;

    // Set up event handlers
    this.recognition.onstart = () => {
      console.log('🎤 Voice recording started');
      this.onStart();
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice transcript:', transcript);
      this.onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('🎤 Voice recognition error:', event.error);
      let errorMessage = 'Voice recognition failed';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking clearly.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone connection.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during voice recognition.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      this.onError(errorMessage);
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recording ended');
      this.onEnd();
    };
  }

  public isVoiceSupported(): boolean {
    return this.isSupported;
  }

  public startRecording(
    onResult: (text: string) => void,
    onError: (error: string) => void,
    onStart: () => void,
    onEnd: () => void
  ) {
    if (!this.isSupported) {
      onError('Speech recognition is not supported in this browser');
      return;
    }

    this.onResult = onResult;
    this.onError = onError;
    this.onStart = onStart;
    this.onEnd = onEnd;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('🎤 Failed to start voice recording:', error);
      onError('Failed to start voice recording');
    }
  }

  public stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public abort() {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  public setLanguage(languageCode: string) {
    if (this.recognition) {
      this.recognition.lang = languageCode;
      console.log('🎤 Voice recognition language set to:', languageCode);
    }
  }
}

// Global instance
let voiceRecorder: VoiceRecorder | null = null;

export function getVoiceRecorder(): VoiceRecorder {
  if (!voiceRecorder) {
    voiceRecorder = new VoiceRecorder();
  }
  return voiceRecorder;
}
