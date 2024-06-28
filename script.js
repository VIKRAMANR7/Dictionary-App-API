const searchInput = document.querySelector(".searchInput");
const closeBtn = document.querySelector(".closeBtn");
const searchBtn = document.querySelector(".searchBtn");
const infoText = document.querySelector(".infoText");
const meaning = document.querySelector(".meaning-para");
const example = document.querySelector(".example-para");
const synonyms = document.querySelector(".synonym-para");
const dictWord = document.querySelector(".dictionary-word");
const partsOfSpeech = document.querySelector(".partsofspeech");
const phonetic = document.querySelector(".phonetic");
const cancelBtn = document.querySelector(".cancelBtn");
const audioBtn = document.querySelector(".audioBtn");
const wrapper = document.querySelector(".wrapper");

searchInput.addEventListener("focus", (e) => {
  e.preventDefault();
  searchBtn.style.color = "rgb(37,99,235)";
});

searchInput.addEventListener("blur", (e) => {
  e.preventDefault();
  searchBtn.style.color = "rgb(156,163,175)";
});

searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  if (e.target.value === "") {
    closeBtn.style.display = "none";
  } else {
    closeBtn.style.display = "block";
  }
});

cancelBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
});

function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>.Please, try to search something else.`;
  } else {
    wrapper.classList.add("active");
    const resultVal = result[0];
    dictWord.textContent = resultVal.word;
    //phonetic
    phonetic.textContent = resultVal.phonetic;
    //partsofspeech
    partsOfSpeech.textContent = resultVal.meanings[0].partOfSpeech;
    //meaning
    meaning.textContent = resultVal.meanings[0].definitions[0].definition;
    //example
    const exampleVal = resultVal.meanings.length - 1;
    const finalVal = resultVal.meanings[exampleVal].definitions.length - 1;
    example.textContent =
      resultVal.meanings[exampleVal].definitions[finalVal].example;
    console.log(resultVal);
    //synonyms
    let synonymVal = "";
    for (let i = 0; i < resultVal.meanings.length; i++) {
      synonymVal += resultVal.meanings[i].synonyms;
    }
    const filteredValue = synonymVal
      .split(",")
      .filter((element, index) => index < 5);
    if (synonymVal.length === 0) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.innerHTML = "";
      for (let i = 0; i < filteredValue.length; i++) {
        let tag = `<span>${filteredValue[i]},</span>`;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
    //audio
    const audioVal = resultVal.phonetics.length - 1;
    const audioSrc = resultVal.phonetics[audioVal].audio;
    let audio = new Audio(audioSrc);

    audioBtn.addEventListener("click", () => {
      audio.play();
    });
  }
}

function fetchAPI(word) {
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span class="font-semibold">"${word}"</span>`;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word));
}

searchInput.addEventListener("keydown", function (event) {
  const word = event.target.value;
  if (event.key === "Enter" && event.target.value) {
    fetchAPI(word);
  }
});
