<template>
  <div class="voice">
    <p>Click the button and speak something</p>
    <button @click="startSpeechRecognition">Start Recognition</button>
    <p>{{transcript}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transcript: ""
    };
  },
  methods: {
    startSpeechRecognition() {
      // check the browser support of Web Speech API
      if (!("webkitSpeechRecognition" in window)) {
        alert("Your browser doesn't support Web Speech API");
        return;
      }
      const recognition = new window.webkitSpeechRecognition();
      // set continuous mode to recognize multiple speech
      recognition.continuous = true;
      recognition.interimResults = true;

      // handle recognition events
      recognition.onstart = (event) => {
        console.log("Speech Recognition Starts", event);
      };

      recognition.onresult = (event) => {
        let finalResult = "";
        let interimResult = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interimResult += event.results[i][0].transcript;
          }
        }
        this.transcript = finalResult + interimResult;
      };

      recognition.onend = (event) => {
        console.log("Speech Recognition Ends", event);
        recognition.stop();
      };

      // start speech recognition
      recognition.start();
    },
  },
};
</script>
<style scoped>
.voice{
margin-top: 4rem;
padding: 4.5rem;
}
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    pad: 20px;
    width: 100%;
    outline: none;
    border: none;
    border-radius:5px ;
    font-size: 20px;
    font-weight: 500;
    text-transform: capitalize;
    cursor: pointer;
    color: #fff;
    background: blue;
}
.bnt .mic-outline {
    font-size: 30px;
}
.btn:disabled{
    cursor: not-allowed;
    background: #fff;
}
.btn.record img {
width: 30px;
height: 30px;
display: none;
}
.record.recording img{
   display: block;
}
.record.recording .mic-outline{
    display: none;
}


.result {
    width: 100%;
    min-height: 200px;
    padding: 10px;
    border: 1px solid #fff;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 20px;
    color: black;
}
.result p {
    display: inline;
    margin-left: 3px;
    color: #fff;
}
.buttons{
    display: flex;
    gap: 20px;
}
</style>
