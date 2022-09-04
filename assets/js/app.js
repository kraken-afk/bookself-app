document.addEventListener("DOMContentLoaded", () => {
  let dataSearch;

  const navBtn = document.querySelectorAll(".anchor-nav a");

  navBtn.forEach(e => e.addEventListener("click", (element) => {
    element.preventDefault();

    const btn = element.target;
    const mainPage = document.querySelector(".main");
    const to = btn.getAttribute("to");

    switch (to) {
      case "home":
        mainPage.classList.remove("active");
        navBtn[0].classList.add("active")
        navBtn[1].classList.remove("active")
        document.body.style.overflowY = "auto";
        break;
      case "add":
        mainPage.classList.add("active");
        navBtn[0].classList.remove("active")
        navBtn[1].classList.add("active")
        document.body.style.overflowY = "hidden";
        break;
      default: return;
    }

  }))

  const LOCAL_KEY = "Bookself";
  const form = document.querySelector(".form");
  const inputs = document.querySelectorAll(".form input");
  let dataLocal = setLocalstorage();
  let tempData = {};

  updateUI();

  inputs.forEach((element) => {
    element.addEventListener("input", (event) => {
      const input = event.target;

      switch (input.name) {
        case "is-complete":
          tempData[input.name] = input.checked;
          break;
        default:
          tempData[input.name] = input.value.toLocaleLowerCase();
      }
    })
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    tempData["is-complete"] = document.getElementById("is-complete").checked;
    tempData["id"] = new Date().toISOString()

    updateLocal();
  })

  function setLocalstorage() {
    if (typeof localStorage === "object") {
      if (localStorage.getItem(LOCAL_KEY) === null) localStorage.setItem(LOCAL_KEY, "[]");
      return JSON.parse(localStorage.getItem(LOCAL_KEY));

    } else return [];
  }

  function updateLocal() {
    dataLocal.push(tempData);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dataLocal));
    tempData = {};
    document.location = "./index.html";
  }

  function updateUI() {
    const cards = createCard(dataLocal);
    const finishedShelf = document.getElementById("finish");
    const unfinishedShelf = document.getElementById("unfinish");

    console.log(dataLocal);
    finishedShelf.innerHTML = String();
    unfinishedShelf.innerHTML = String();

    cards.finished.forEach(e => {
      finishedShelf.innerHTML += e;
    });
    cards.unfinished.forEach(e => {
      unfinishedShelf.innerHTML += e;
    });

    updateSearchResult()
  }

  function createCard(data) {
    const finishCard = [];
    const unfinishCard = [];

    data.forEach((e) => {
      if (e["is-complete"]) {
        finishCard.push(`<div class="card-book" data-id="${e.id}">
                <div class="card-content">
                  <h3>${e.title}</h3>
                  <span class="author">${e.author}. </span>
                  <span class="year">${e.year}</span>
                </div>
                <div class="card-buttons">
                  <button class="card-btn undo-btn">Undo</button>
                  <button class="card-btn delete-btn">Delete</button>
                </div>
              </div>`)
      }
      else {
        unfinishCard.push(`<div class="card-book" data-id="${e.id}">
                <div class="card-content">
                  <h3>${e.title}</h3>
                  <span class="author">${e.author}. </span>
                  <span class="year">${e.year}</span>
                </div>
                <div class="card-buttons">
                  <button class="card-btn finish-btn">Finish</button>
                  <button class="card-btn delete-btn">Delete</button>
                </div>
              </div>`)
      }
    })

    return ({
      finished: finishCard,
      unfinished: unfinishCard,
    })
  }



  const cardContainer = document.querySelector(".main-wrapper");

  cardContainer.addEventListener("click", (event) => {
    const card = event.target.parentElement.parentElement.dataset.id;
    const index = dataLocal.findIndex((value) => value.id === card);
    const object = dataLocal.find((value) => value.id === card)
    const type = event.target.classList[event.target.classList.length - 1]

    if (!card) return;

    switch (type) {
      case "finish-btn":
        object["is-complete"] = true;
        dataLocal[index] = object;
        break;
      case "undo-btn":
        object["is-complete"] = false;
        dataLocal[index] = object;
        break;
      case "delete-btn":
        if (!confirm("are you sure want to delete " + object.title + "?")) return;
        dataLocal = dataLocal.filter(e => e.id !== card);
        break;
      default: return;
    }
    updateUI();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dataLocal));
  })



  const formSearch = document.getElementById("form-search");
  const closeBtn = document.querySelector(".close");
  const searchSection = document.querySelector(".search-section");
  const shelf = document.getElementById("search-shelf");

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const str = e.target.children[0].value.trim().toLocaleLowerCase();

    if (!str) return
    const status = dataLocal.some((e) => e.title === str);

    if (!status) alert("can't find book with title " + str);
    else {
      dataSearch = dataLocal.filter((e) => e.title === str);
      updateSearchResult();
      searchSection.classList.remove("hidden");
    }
    e.target.children[0].value = String();
  })

  closeBtn.addEventListener("click", () => {
    shelf.innerHTML = String();
    searchSection.classList.add("hidden");
  })

  shelf.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;
    shelf.innerHTML = String();
    searchSection.classList.add("hidden");
  })

  function updateSearchResult() {
    if (typeof dataSearch === "undefined") return;
    const cards = createCard(dataSearch);

    shelf.innerHTML = String();
    for (const key in cards) {
      cards[key].forEach(e => {
        shelf.innerHTML += e;
      })
    }

  }
})