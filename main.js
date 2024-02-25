import { vagueFinder } from "vague-finder";

const {
  loadModel,
  getProgress,
  compareTwoSentences,
  compareSentenceToArray,
  arrayInOrder,
  getCached,
  cachedArrayInOrder,
} = vagueFinder;

let test = [
  "The crimson sky heralds the setting sun behind the mountains.",
  "Behind the mountains, the sun paints the sky a fiery crimson.",
  "The mountains cast a silhouette against the crimson-painted sky at sunset.",
  "The aroma of freshly baked bread filled the cozy kitchen.",
  "A gentle breeze rustled the leaves, whispering secrets to the trees.",
  "The city streets buzzed with the hustle and bustle of commuters.",
  "A solitary candle flickered in the dimly lit room, casting shadows on the walls.",
];

let array = test;
let inputAddItem = document.getElementById("inputItem");
let inputDes = document.getElementById("inputField");
let isModelLoaded = false;
let searchButton = document.getElementById("searchButton");
let cacheButton = document.getElementById("cacheButton");
let cacheSearchButton = document.getElementById("cacheSearchButton");
let cachedArray = null;

function addSentenceToList(text) {
  if (text === "") {
    return;
  }
  array.push(text);
  renderList(array);
  inputAddItem.value = "";
}

document.getElementById("add-button").addEventListener("click", function () {
  addSentenceToList(inputAddItem.value);
});

function renderList(array) {
  let listEl = document.getElementById("list");
  if (array.length === 0) {
    listEl.innerHTML = `<span id="empty">Empty</span>`;
    return;
  }
  listEl.innerHTML = array.map((sentence) => `<li>${sentence}</li>`).join("");
}

let timeoutId = null;

searchButton.addEventListener("click", function () {
  if (inputDes.value === "") {
    return;
  }
  if (!isModelLoaded) {
    showModelLoadingScreen();
    loadModel().then((res) => {
      isModelLoaded = true;
      putInOrder(inputDes.value);
    });
  } else {
    document.getElementById("list").innerHTML =
      `<span id="empty">Searching...</span>`;
    setTimeout(() => {
      putInOrder(inputDes.value);
    }, 0);
  }
});

cacheButton.addEventListener("click", function () {
  if (!isModelLoaded) {
    showModelLoadingScreen(true);
    loadModel().then((res) => {
      isModelLoaded = true;
      getCachedArray(array).then((res) => {
        cachedArray = res;
        renderList(array);
      });
    });
  } else {
    document.getElementById("list").innerHTML =
      `<span id="empty">Caching...</span>`;
    setTimeout(() => {
      getCachedArray(array).then((res) => {
        cachedArray = res;
        renderList(array);
      });
    }, 0);
  }
});

cacheSearchButton.addEventListener("click", function () {
  if (!cachedArray) {
    // Array has not been cached
    console.log("Array has not been cached");
    return;
  }
  cachedArrayInOrder(inputDes.value, cachedArray).then((res) => {
    let tempArr = res.array.map((obj) => {
      return obj.sentenceTwo;
    });
    renderList(tempArr);
  });
});

function putInOrder(inputText) {
  if (!isModelLoaded) {
    return;
  }
  let orderedArray = null;
  arrayInOrder(inputText, array).then((res) => {
    console.log(res);
    let tempArr = res.array.map((obj) => {
      return obj.sentenceTwo;
    });
    renderList(tempArr);
  });
}

function showModelLoadingScreen(isCaching) {
  let listEl = document.getElementById("list");
  listEl.innerHTML = `<span id="empty">Loading Model...</span>`;
  if (isCaching) {
    listEl.innerHTML = `<span id="empty">Caching...</span>`;
    return;
  }
  caches.keys().then((res) => {
    if (res.includes("transformers-cache")) {
      listEl.innerHTML = `<span id="empty">Searching...</span>`;
    }
  });
}

async function getCachedArray(array) {
  if (!isModelLoaded) {
    return;
  }
  return getCached(array);
}

// <div class="buttonContainer">
//   <div class="normalButtonContainer">
//     <button id="searchButton">Search</button>
//   </div>
//   <div class="cacheButtonContainer">
//       <button id="cacheButton">Cache</button>
//       <button id="cacheSearchButton">Fast Search</div>
// </div>
// </div>

renderList(array);
