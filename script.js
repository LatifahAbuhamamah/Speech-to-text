const recordBtn = document.querySelector(".record");
const result = document.querySelector(".result");
const downloadBtn = document.querySelector(".download");
const inputLanguage = document.querySelector("#language");
const clearBtn = document.querySelector(".clear");
let recognition=false;

function populateLanguages() {
  languages.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.textContent = lang.name;
    inputLanguage.appendChild(option);
  });
}

function speechToText() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = inputLanguage.value;
  recognition.interimResults = true;

  result.innerHTML = ""; // Clear existing results
  downloadBtn.disabled = true;

  recognition.onresult = event => {
    const speechResult = event.results[event.results.length - 1][0].transcript;

    if (event.results[0].isFinal) {
      result.innerHTML += " " + speechResult;
    } else {
      let interim = document.querySelector(".interim");
      if (!interim) {
        interim = document.createElement("p");
        interim.classList.add("interim");
        result.appendChild(interim);
      }
      interim.textContent = " " + speechResult;
    }

    downloadBtn.disabled = false;
  };

  recognition.onerror = event => {
    recognition.stop();
    console.error("Recognition error:", event.error);
  };

  recognition.onend = () => {
    recognition = null;
    recordBtn.querySelector("p").textContent = "Start Recording";
  };

  recognition.start();
  recordBtn.querySelector("p").textContent = "Recording......";
}

function sendTranscriptionToServer(transcription) {
  fetch('store.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `transcription=${encodeURIComponent(transcription)}`,
  })
  .then(response => response.text())
  .then(data => console.log(data)) // Display the server response
  .catch(error => console.error('Error:', error));
}


recordBtn.addEventListener("click", () => {
  if (!recognition) {
    speechToText();
  } else {
    recognition.stop();
  }
});

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  downloadBtn.disabled = true;
});

downloadBtn.addEventListener("click", () => {
  const text = result.textContent;
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href", "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});

populateLanguages();
