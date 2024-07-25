import { games } from "../config/games.js";

const itemsPerPage = 5;
let currentPage = 1;
let filteredGames = [...games];
let showFavoritesOnly = false;

function getMinPrice(history) {
  let minPrice = parseFloat(
    history.DaysAgo1.replace("R$", "").replace(",", ".")
  );
  let minDay = 1;

  for (let i = 2; i <= 60; i++) {
    const priceValue = parseFloat(
      history[`DaysAgo${i}`].replace("R$", "").replace(",", ".")
    );
    if (priceValue < minPrice) {
      minPrice = priceValue;
      minDay = i;
    }
  }

  return { minPrice, minDay };
}

function filterGames() {
  const form = document.getElementById("filter-form");
  const formData = new FormData(form);

  const selectedStores = formData.getAll("store");
  const selectedPrice = formData.get("price");
  showFavoritesOnly = formData.has("favorites");

  filteredGames = games.filter((game) => {
    const gameStores = Object.keys(game.prices);
    const matchesStore =
      selectedStores.length === 0 ||
      selectedStores.some((store) => gameStores.includes(store));

    let matchesPrice = true;
    if (selectedPrice) {
      const gamePrice = parseFloat(
        game.priceHistory.DaysAgo1.replace("R$", "").replace(",", ".")
      );
      if (selectedPrice === "low") {
        matchesPrice = gamePrice < 50;
      } else if (selectedPrice === "medium") {
        matchesPrice = gamePrice >= 50 && gamePrice <= 100;
      } else if (selectedPrice === "high") {
        matchesPrice = gamePrice > 100;
      }
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  
    if (!loggedUser) {
      console.error("Nenhum usuário logado.");
      return;
    }
  
    const userIndex = users.findIndex((user) => user.email === loggedUser.email);
  
    if (userIndex === -1) {
      console.error("Usuário logado não encontrado na lista de usuários.");
      return;
    }
  
    const favoriteGames = users[userIndex].favorites || [];
    const isFavorite = favoriteGames.includes(game.title);
    console.log("isFavorite:", isFavorite);
    const matchesFavorites = !showFavoritesOnly || isFavorite;

    return matchesStore && matchesPrice && matchesFavorites;
  });

  currentPage = 1;
  displayGames(currentPage);
}

export function displayGames(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const gamesToDisplay = filteredGames.slice(start, end);

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  gamesToDisplay.forEach((game, index) => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    gameCard.dataset.id = `${game.title}`;
    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    const img = document.createElement("img");
    img.className = "capa";
    img.src = game.cover;
    img.alt = `Capa do ${game.title}`;

    const gameDetails = document.createElement("div");
    gameDetails.className = "game-details";

    const starIcon = document.createElement("div");
    starIcon.className = "fas fa-star";
    starIcon.addEventListener("click", () => toggleFavorite(starIcon));

    const gameTitle = document.createElement("h2");
    gameTitle.className = "game-title";
    gameTitle.textContent = game.title;

    const gamePrices = document.createElement("ul");
    gamePrices.className = "game-prices";
    for (const [store, price] of Object.entries(game.prices)) {
      const li = document.createElement("li");
      li.textContent = `${store}: ${price}`;
      gamePrices.appendChild(li);
    }

    const { minPrice, minDay } = getMinPrice(game.priceHistory);
    const minPriceFixedLabel = document.createElement("h2");
    minPriceFixedLabel.className = "min-price";
    minPriceFixedLabel.textContent = `Menor Preço : R$ ${minPrice.toFixed(
      2
    )} há ${minDay} dias`;

    const priceHistory = document.createElement("div");
    priceHistory.className = "price-history";
    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    const chart = document.createElement("canvas");
    chart.id = `priceChart-${index}`;
    chart.role = "img";
    chart.height = "auto";
    chart.width = "auto";

    const sliderContainer = document.createElement("div");
    sliderContainer.className = "slider-container";
    const sliderLabel = document.createElement("label");
    let days = 1;
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 1;
    slider.max = 40;
    slider.value = slider.max - 1;
    slider.addEventListener("input", () => {
      days = slider.max - (slider.value - 1);
      sliderLabel.textContent = "Menor preço a: " + days + " dias";
      minPriceLabel.textContent =
        "Preço: " + game.priceHistory[`DaysAgo${days}`];
    });
    sliderLabel.textContent =
      "Menor preço a : " + (slider.max - slider.value) + " dias";
    const minPriceLabel = document.createElement("h2");
    minPriceLabel.className = "min-price";
    minPriceLabel.textContent = "Preço: " + game.priceHistory[`DaysAgo1`];

    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(minPriceLabel);

    chartContainer.appendChild(chart);
    gameDetails.appendChild(gameTitle);
    gameDetails.appendChild(gamePrices);
    priceHistory.appendChild(chartContainer);
    priceHistory.appendChild(sliderContainer);
    priceHistory.appendChild(minPriceFixedLabel);
    imgContainer.appendChild(img);
    gameCard.appendChild(imgContainer);
    gameCard.appendChild(gameDetails);
    gameCard.appendChild(priceHistory);
    gameCard.appendChild(starIcon);
    resultado.appendChild(gameCard);

    const ctx = document.getElementById(`priceChart-${index}`).getContext("2d");
    const prices = [];
    for (let i = 1; i <= 40; i++) {
      prices.push(
        parseFloat(
          game.priceHistory[`DaysAgo${i}`].replace("R$", "").replace(",", ".")
        )
      );
    }
    const labels = Array.from({ length: 40 }, (_, i) => `${40 - i} `);
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Preços nos últimos 40 dias",
            data: prices,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Dias atrás",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Preço (R$)",
            },
          },
        },
      },
    });
  });
  loadFavorites();
  displayPagination();
}

function toggleFavorite(icon) {
  const gameCard = icon.closest(".game-card");

  if (!gameCard) {
    console.error("Elemento com a classe .game-card não encontrado.");
    return;
  }

  const gameId = gameCard.dataset.id;

  if (!gameId) {
    console.error("ID do jogo não encontrado no dataset.");
    return;
  }

 
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    alert("Nenhum usuário logado.");
    return;
  }
  const isFavorite = icon.classList.toggle("favorite");
  const userIndex = users.findIndex((user) => user.email === loggedUser.email);

  if (userIndex === -1) {
    console.error("Usuário logado não encontrado na lista de usuários.");
    return;
  }

  const favoriteGames = users[userIndex].favorites || [];

  if (isFavorite) {
    if (!favoriteGames.includes(gameId)) {
      favoriteGames.push(gameId);
      document.getElementById("message-text").innerText =
        "Jogo adicionado aos favoritos!";
      openModalWithAutoClose("Jogo adicionado aos favoritos!");
    }
  } else {
    const index = favoriteGames.indexOf(gameId);
    if (index > -1) {
      favoriteGames.splice(index, 1);
      document.getElementById("message-text").innerText =
        "Jogo removido dos favoritos!";
      openModalWithAutoClose("Jogo removido dos favoritos!");
    }
  }

  users[userIndex].favorites = favoriteGames;
  localStorage.setItem("users", JSON.stringify(users));
}

function loadFavorites() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    console.error("Nenhum usuário logado.");
    return;
  }

  const userIndex = users.findIndex((user) => user.email === loggedUser.email);

  if (userIndex === -1) {
    console.error("Usuário logado não encontrado na lista de usuários.");
    return;
  }

  const favoriteGames = users[userIndex].favorites || [];
  console.log(favoriteGames);
  const gameCards = document.querySelectorAll(".game-card");
  gameCards.forEach((card) => {
    const gameId = card.dataset.id;
    const icon = card.querySelector(".fas.fa-star");
    console.log(favoriteGames.includes(gameId));

    if (favoriteGames.includes(gameId)) {
      icon.classList.add("favorite");
    } else {
      icon.classList.remove("favorite");
    }
  });
}

function displayPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageLink.className = i === currentPage ? "active" : "";

    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      displayGames(currentPage);
    });

    pagination.appendChild(pageLink);
  }
}

export function pageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("nome-jogo")) {
    let searchQuery = urlParams.get("nome-jogo");
    const searchResults = games.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (searchResults.length > 0) {
      filteredGames = searchResults;
      currentPage = 1;
      displayGames(currentPage);
    } else {
      const resultado = document.getElementById("resultado");
      resultado.innerHTML = "<p>Nenhum jogo encontrado.</p>";
      const pagination = document.getElementById("pagination");
      pagination.innerHTML = "";
    }
  } else {
    filteredGames = [...games];
    displayGames(currentPage);
  }

  document.getElementById("filter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    filterGames();
  });
}


