import { vagueFinder } from "vague-finder";

const {
  loadModel,
  getProgress,
  compareTwoSentences,
  compareSentenceToArray,
  arrayInOrder,
  getCached,
  cachedCompareSentenceToArray,
  cachedArrayInOrder,
  getTop,
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
let valueInsertedAfterCache = false;

function addSentenceToList(text) {
  if (text === "") {
    return;
  }
  array.push(text);
  renderList(array);
  inputAddItem.value = "";
}

document.getElementById("add-button").addEventListener("click", function () {
  valueInsertedAfterCache = true;
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

searchButton.addEventListener("click", async function () {
  if (inputDes.value === "") {
    return;
  }
  if (!isModelLoaded) {
    await showModelLoadingScreen();
    loadModel().then((res) => {
      isModelLoaded = true;
      putInOrder(inputDes.value);
    });
  } else {
    document.getElementById(
      "list"
    ).innerHTML = `<span id="empty">Searching...</span>`;
    setTimeout(() => {
      putInOrder(inputDes.value);
    }, 0);
  }
});

cacheButton.addEventListener("click", async function () {
  valueInsertedAfterCache = false;
  if (!isModelLoaded) {
    await showModelLoadingScreen(true);
    loadModel().then((res) => {
      isModelLoaded = true;
      getCachedArray(array).then((res) => {
        cachedArray = res;
        renderList(array);
      });
    });
  } else {
    document.getElementById(
      "list"
    ).innerHTML = `<span id="empty">Caching...</span>`;
    setTimeout(() => {
      getCachedArray(array).then((res) => {
        cachedArray = res;
        renderList(array);
      });
    }, 0);
  }
});

cacheSearchButton.addEventListener("click", function () {
  if (valueInsertedAfterCache) {
    popup(
      "New items have been added to the list after caching\nClick 'Cache' again" 
      );
    return;
  }
  if (!cachedArray) {
    popup(`List has not been cached\nClick 'Cache'`);
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

async function showModelLoadingScreen(isCaching) {
  let listEl = document.getElementById("list");
  listEl.innerHTML = `<span id="empty">Loading Model...</span>`;
  if (isCaching) {
    listEl.innerHTML = `<span id="empty">Caching...</span>`;
    return;
  }
  let res = await caches.keys();
  if (res.includes("transformers-cache")) {
    listEl.innerHTML = `<span id="empty">Searching...</span>`;
  }
}

async function getCachedArray(array) {
  if (!isModelLoaded) {
    return;
  }
  return getCached(array);
}

renderList(array);

function popup(message) {
  const notification = document.getElementById("notification");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  popupText.innerText = message;
  notification.style.display = "grid";
  notification.addEventListener("click", function () {
    notification.style.display = "none";
  });
  popup.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
