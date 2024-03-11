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

let notes_headings = [
  "Embarking on a Journey into Quantum Mechanics and the Unknown",
  "Exploring Neuroscience Insights into the Mysteries of the Human Brain",
  "Mastering the Art of Persuasion Rhetoric and Influence",
  "Unlocking the Power of Big Data Analytics for Insights",
  "A Historical Exploration Traversing the Depths of Civilization",
  "Startup Adventures Tales from the Entrepreneurial World",
  "Discovering the Magic Within Pages An Exploration of Literature",
  "Towards a Greener Future Charting the Path to Environmental Sustainability",
  "Building Intelligent Systems Navigating the World of Artificial Intelligence",
  "Exploring the Language of Music Harmony, Rhythm, and Melody",
  "Decoding the Universe A Quest for Fundamental Laws of Nature",
  "Culinary Chronicles Stories from the Kitchen and Beyond",
  "The Pursuit of Well-being Understanding the Psychology of Happiness",
  "Chronicles of Wanderlust Adventures Across Continents",
  "From Canvas to Creation A Journey in the World of Fine Arts",
  "The Inner Workings of Economics Understanding Market Dynamics",
  "Embarking on a Journey into the Depths of Astrophysics and the Cosmos",
  "Crafting Narratives That Resonate The Power of Storytelling",
  "Philosophy's Journey Exploring Life's Fundamental Questions",
  "The Evolution of Technology From the Wheel to Artificial Intelligence",
  "Adventures in Psychology Unraveling the Mysteries of the Human Mind",
  "Navigating the World of Medicine Understanding Health and Disease",
  "Wonders of Nature Exploring Earth's Rich Biodiversity",
  "Challenges in Global Politics Understanding International Relations",
  "The Beauty of Mathematics Exploring Patterns and Formulas",
  "The Art of Photography Capturing Moments in Time",
  "Exploring the Universe of Video Games Immersive Virtual Worlds",
  "Journeys in Education Nurturing Minds for Tomorrow",
  "Discovering the World of Fashion Exploring Style and Trends",
  "Thrills of Adventure Sports Pushing Limits in Extreme Environments",
  "Harmony of Yoga Balancing Mind, Body, and Spirit",
  "Culinary Delights Exploring Flavors from Around the Globe",
  "Tales of Mythology Exploring Ancient Legends and Lore",
  "World of Robotics Building Machines for Tomorrow",
  "Exploring the Depths of Oceanography Unveiling the Secrets of the Seas",
  "Art of Communication Mastering the Exchange of Ideas",
  "Exploring the World of Architecture Understanding Structures and Spaces",
  "Healing Through Sound and Rhythm The Power of Music Therapy",
  "Exploring Classic and Contemporary Works Journeys in Literature",
  "Protecting Information in the Digital Age Unraveling the Secrets of Cryptography",
  "Discovering New Frontiers The Fascination of Space Exploration",
  "Exploring Legends of Dragons and Griffins Tales from Mythical Creatures",
  "Understanding Human History From Ancient Civilizations to Modern Societies",
  "Bringing Characters to Life The Magic of Animation",
  "Cultivating Plants and Nurturing the Earth The Joy of Gardening",
  "Protecting Wildlife and Habitats Adventures in Environmental Conservation",
  "Immersive Experiences in Digital Worlds Exploring the World of Virtual Reality",
  "Tracing the Evolution of Creativity The Beauty of Art History",
  "Discovering New Lands and Cultures Tales of Exploration and Discovery",
  "Understanding Diversity and Traditions The Intricacies of Cultural Anthropology",
  "Navigating Business Ventures The World of Entrepreneurial Innovation",
  "Exploring Ideas of Existence and Consciousness Journeys in Philosophy",
  "Cultivating Happiness and Well-being The Power of Positive Psychology",
  "Exploring the Cosmos Beyond Our Planet The Wonders of Astronomy",
  "Crafting Persuasive Presentations The Art of Public Speaking",
  "Cultivating Awareness and Presence Journeys in Mindfulness",
  "Exploring New Destinations and Cultures The Adventure of Traveling",
  "Crafting Narratives That Inspire The Art of Storytelling",
  "Pushing Limits in Adrenaline-Pumping Activities The Thrill of Extreme Sports",
  "Bringing Stories to Life on the Big Screen Adventures in Film-making",
  "Exploring Nature's Diversity The Beauty of Botanical Gardens",
  "Exploring Computing Beyond Classical Limits The World of Quantum Computing",
  "Understanding Microscopic Life The Fascinating World of Microbiology",
  "Nurturing and Raising Children The Joys of Parenthood",
  "Understanding the Role of Food in Health The Science of Nutrition",
  "Uncovering Lost Worlds The Exploration of Ancient Civilizations",
  "Cultivating Inner Peace and Tranquility The Serenity of Meditation",
  "Mastering Diplomacy and Conflict Resolution The Art of Negotiation",
  "Exploring Off-the-Beaten-Path Destinations The Excitement of Adventure Travel",
  "Exploring Sustainable Power Sources The World of Renewable Energy",
  "Capturing Nature's Beauty The Wonder of Wildlife Photography",
  "Discovering Hidden Underground Wonders The Adventure of Exploring Caves",
  "Exploring Styles of the Past The Allure of Vintage Fashion",
  "Understanding Earth's Changing Climate The Science of Climate Change",
  "Observing Feathered Friends in their Natural Habitat The Joy of Birdwatching",
  "Making a Difference in Global Communities The World of Humanitarian Aid",
  "Capturing Time in Motion The Fascination of Time-lapse Photography",
  "Discovering Hidden Gems in Cities The Excitement of Urban Exploration",
  "Conquering Peaks Around the Globe The Thrill of Mountain Climbing",
];

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
    popup(`Array has not been cached\nClick 'Cache'`);
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
