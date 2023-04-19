# 3D ChatGPT Assistant

This is a small application that uses r3f and some useful tools like three, zustand and koestlich to interact with ChatGPT in a 3D environment.

It is designed as a 3D AI assistant in a VR/AR financial application.
The 3D model can be easily exchanged and customised with the internal state of the assistant according to your wishes.

The old TextInput has been removed. To start a conversation (aka start recording your voice) simply click the assistant and to stop recording click it again.

Then the whole OpenAI-Whisper transcription and ChatGPT request starts. This may take a few seconds, depending on the input and output of the request. The assistant turns orange and rotates as it processes the request. Just let it be :D

**_Info_**  
You need an OpenAI account, an OpenAI API key and a way to pay for the requests.  
[OpenAI Platform](https://platform.openai.com/)

ChatGPT is given a small context that can be change in the `AssistantState.ts` file.

```js
"You are a personal finance assistant called Paul." +
"You are programmed for virtual and augmented reality environments. " +
"Keep your answers short but informative. ",
// "Be a little bit funny while explaining, talking or responding. ",
```

Play around with these settings, it's absolutely hilarious how it responds when you give it the right context!

## **Getting Started**

Create a .env file in the same folder as package.json with the content

```.env
REACT_APP_PUBLIC_OPENAI_API_KEY=YOUR-OPENAI-API-KEY
```

Then

```zsh
npm install && npm run start
```

and you are good to go!

## **Develpoment**

### **TODO**

- [x] Use SpeechSynthesis Web API for Text-To-Speech
- [x] Find good SpeechSynthesisiUtterance voices that sound nice.
- [x] Implement Whisper Speech-To-Text (Text Input has been removed)
- [ ] Use WebAudioAnalyzer to let the assistant react to what it's saying
- [ ] Use a more complex 3D model like a gltf model made in blender with animations etc.
- [ ] Update the context/system message of ChatGPT to support complex requestes
- [ ] Add subtitles to the assistant

### **Nice-To-Have**

- [ ] Use Google-TTS-Cloud-API to make the voice way more realistic than SpeechSynthesis (costs!!)
- [ ] Experiment with other contexts

#### **Application**

This is just for later later. The assistant should be integrated into a financial AR-application.

- [ ] Mulituser
- [ ] Financal tools like Panels and buy/sell buttons, realtime portfolio data, etc.

## _ChatGPT context in the future and what I want to do with it..._

So the idea is that somewhere in the context ChatGPT knows about a users Stock-Portfolio, realtime stock data and current financial news.
I don't know how this is going to be possible. Maybe in the near future OpenAI will catch up to Google Bard or the Microsoft Bing AI to access realtime data. Maybe...

Also the response should support things like when i make the request "Show me the performance of apple in the last 30 Days" somewhere in the response there should be a line that says "/view AAPL 30 d" or somethings similar. That way the application around the assistant can "react" to th specific responsens and show the stock in 3D next to you with the data the user requested.

## _Links_

[BloombergGPT](https://www.bloomberg.com/company/press/bloomberggpt-50-billion-parameter-llm-tuned-finance/)  
[Bard by Google](https://bard.google.com/?hl=en)
