# 3D ChatGPT Assistant

This is a small application that uses r3f and some useful tools like three, zustand and koestlich to interact with ChatGPT in a 3D environment.

It is designed as a 3D AI assistant in a VR/AR financial application.
The 3D model can be easily exchanged and customised with the internal state of the assistant according to your wishes.

There is also some preparation for user voice input, but the resulting file format is not currently supported by the OpenAI Whisper API.

Hence the text input and the send button.

***Info***  
You need an OpenAI account, an OpenAI API key and a way to pay for the requests.  
[OpenAI Platform](https://platform.openai.com/)

## Getting Started

Create a .env file in the same folder as package.json with the content

```
REACT_APP_PUBLIC_OPENAI_API_KEY=YOUR-OPENAI-API-KEY
```

Then

```
npm install && npm run start
```

and you are good to go!
