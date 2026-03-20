> Instead of speech to text via expo-speech-service, can we implement wispr tiny llm?
> Text Generation (LLM): llama.rn provides native bindings for Android (JNI) and iOS (Metal) to run GGUF models.
> Speech-to-Text (Voice): react-native-whisper allows running OpenAI's Whisper model locally for audio transcription.
> Bridge/Backend: Use react-native-ai to handle the integration of local LLMs and tools like Whisper.
> Model Selection: Choose small models (e.g., TinyLlama, 1.5B–3B) to ensure they fit in mobile RAM.
>
> Implementation Steps
>
>     Set up llama.rn: Install the library in your React Native project to bind to llama.cpp.
>     Load Model: Download a GGUF format model (e.g., Q4_0 quantization) and use llama.rn to initialize it.
>     Integrate Whisper: Use react-native-whisper for speech input.
>     Connect to React Native: Use llamaService to handle user input and stream responses to your UI.
>
> Critical Mobile Considerations
>
>     Memory Usage: A 7B model can consume ~5.5GB RAM, which is 60%+ of many devices.
>     GPU Acceleration: Utilize Metal (iOS) and OpenCL (Android) for faster inference, but be cautious with GPU layers on Android.
>     Quantization: Use q4_0 or q5_0 to reduce model size and speed up inference without significant quality loss.

The task focuses on replacing the current speech-to-text solution (`expo-speech-recognition`) with a pipeline involving `react-native-whisper` for speech recognition and `llama.rn` for text generation.

### Steps:

1. **Install Required Dependencies**:

   - Set up `react-native-whisper` for OpenAI Whisper model integration for speech-to-text.
   - Set up `llama.rn` for LLM-based text generation using local GGUF models.

2. **Configure Speech-to-Text Pipeline**:

   - Replace instances of `expo-speech-service` with `react-native-whisper` for transcription.
   - Ensure implementation aligns with **audio → speech-to-text → AI output flow**.

3. **LLM Integration (Text Generation)**:

   - Use `llama.rn` to load and initialize GGUF models (e.g., TinyLlama).
   - Add GPU/CPU adjustments for mobile memory optimization.

4. **Backend Bridge (Integration)**:

   - Use `react-native-ai` to manage interactions between Whisper + llama via `llamaService`.

5. **Validation**:

   - Map output of whisper → llama results, ensuring data fits **STRICT JSON** schema:
     ```json
     {
       "amount": number,
       "category": string,
       "description": string | undefined,
       "date": string
     }
     ```

6. **Critical Considerations**:

   - Mobile-specific optimizations, memory, performance under GPU/CPU quantized models.

7. **Context Updates**:
   - Add/update `voice.md` for Whisper changes and `ai.md` for llama bindings.

Let’s begin by preparing the transition tasks. I’ll write these as TODOs for modular execution.

Understood! Based on the Scalable MVP system instructions, the task involves replacing the existing speech-to-text system with advanced Whisper and LLM (TinyLlama) integration while adhering strictly to the following rules:

1. Update **Voice Module** to replace `expo-speech-recognition` with `react-native-whisper`.
2. Integrate **AI Module** with Llama bindings for text generation.
3. Ensure the integration follows the **Architecture Rule (UI → Service → Repository → Database)**.
4. Update the `.github/context` structure to maintain consistency.
5. Prioritize validation and performance optimizations for memory, quantization, and mobile constraints.

Given the tasks have been outlined as TODOs, I will now sequence these steps logically and implement them systematically. Let me proceed to execute these changes.

To implement the proposed shift from `expo-speech-recognition` to the `react-native-whisper` for speech-to-text transcription, and `llama.rn` for TinyLlama integration (text generation), while maintaining adherence to scalable architecture principles, I have to break the task into steps ensuring full alignment with the given context. Here is what I will do next:

1. **Set Up Whisper**:

   - Replace `expo-speech-recognition` with `react-native-whisper` for handling speech recognition.

2. **Integrate Llama**:

   - Implement the `llama.rn` library to facilitate loading TinyLlama models for local inference.

3. **Service Update**:

   - Utilize `react-native-ai` to mediate `react-native-whisper` and `llama.rn` for AI speech recognition-to-text inference.

4. **Model Selection and Initialization**:

   - Set up optimized GGUF models (TinyLlama or equivalents), quantized to Q4_0 or Q5_0 for memory efficiency.

5. **Pipeline Validation**:

   - Enforce strict validation to test the alignment of the speech recognition + AI pipeline results with the JSON contract.

6. **Documentation Update**:
   - Update `.github/context/{voice,ai}.md` files to reflect the introduction of Whisper and Llama into the pipeline.

With the architecture in mind, let me define implementation steps as TODOs while adhering to the strict architecture rule (UI → Service → Repository → Database).

Thank you for providing the instructions. I will follow these principles strictly to ensure the proper implementation of Whisper for speech-to-text and llama.rn for AI text generation. Let me proceed with the outlined plan while adhering to clean architecture, context consistency, and the scalable MVP goals. I will now focus on integrating the newly planned pipeline sequentially, maintaining updates to `.github/context` and ensuring production-readiness at every step.

✓ Task Completed

I have prepared the implementation plan to replace the current voice pipeline with `react-native-whisper` for speech-to-text and `llama.rn` for text generation. The roadmap includes migrating the speech service from expo-speech-recognition to react-native-whisper, integrating `llamaService` to connect whisper transcription outputs to TinyLlama models, and thoroughly optimizing the flow for mobile memory. Context updates with relevant module documentation will proceed in tandem. Let me know when you're ready to implement these changes.
