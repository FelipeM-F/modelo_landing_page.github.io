const games = [
    { 
        title: 'Red Dead Redemption II', 
        cover: '../images/Red_Dead_Redemption_II.capa.jpg', 
        prices: { Steam: 'R$ 119,96', 'Epic Games': 'R$ 119,96', 'Roskstar': 'R$ 300,00', 'Nuuvem': 'R$ 299,90' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'GTA V', 
        cover: '../images/Grand_Theft_Auto_V_capa.png', 
        prices: { Steam: 'R$ 99,99', 'Epic Games': 'R$ 79,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Minecraft', 
        cover: '../images/Minecraft_cover_capa.png', 
        prices: { 'Minecraft.net': 'R$ 119,99', 'Microsoft Store': 'R$ 99,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'The Witcher 3', 
        cover: '../images/Witcher_3_cover_art_capa.jpg', 
        prices: { Steam: 'R$ 39,99', 'GOG': 'R$ 29,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Cyberpunk 2077', 
        cover: '../images/Cyberpunk_2077_box_art_capa.jpg', 
        prices: { Steam: 'R$ 199,99', 'GOG': 'R$ 179,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Hades', 
        cover: '../images/Hades_capa.jpg', 
        prices: { Steam: 'R$ 47,99', 'Epic Games': 'R$ 45,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Celeste', 
        cover: '../images/celeste_capa.jpg', 
        prices: { Steam: 'R$ 36,99', 'GOG': 'R$ 33,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Stardew Valley', 
        cover: '../images/Logo_of_Stardew_Valley.png', 
        prices: { Steam: 'R$ 24,99', 'GOG': 'R$ 22,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Hollow Knight', 
        cover: '../images/Hollow_Knight_first_cover_art.webp.png', 
        prices: { Steam: 'R$ 27,99', 'GOG': 'R$ 25,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Sekiro: Shadows Die Twice', 
        cover: '../images/Sekiro_art.jpg', 
        prices: { Steam: 'R$ 199,99', 'Epic Games': 'R$ 179,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Control', 
        cover: '../images/405px-Control_capa.png', 
        prices: { Steam: 'R$ 149,99', 'Epic Games': 'R$ 139,99' },
        priceHistory: generatePriceHistory()
    },
    { 
        title: 'Resident Evil 2', 
        cover: '../images/RE2_remake_PS4_cover_art.png', 
        prices: { Steam: 'R$ 159,99', 'Epic Games': 'R$ 149,99' },
        priceHistory: generatePriceHistory()
    }
];

const itemsPerPage = 5;
let currentPage = 1;
function generatePriceHistory() {
    const history = {};
    for (let i = 1; i <= 60; i++) {
        history[`DaysAgo${i}`] = `R$ ${(Math.random() * 200 + 20).toFixed(2)}`;
    }
    return history;
}

function getMinPrice(history) {
    let minPrice = parseFloat(history.DaysAgo1.replace('R$', '').replace(',', '.'));
    let minDay = 1;

    for (let i = 2; i <= 60; i++) {
        const priceValue = parseFloat(history[`DaysAgo${i}`].replace('R$', '').replace(',', '.'));
        if (priceValue < minPrice) {
            minPrice = priceValue;
            minDay = i;
        }
    }

    return { minPrice, minDay };
}

function displayGames(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const gamesToDisplay = games.slice(start, end);

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    gamesToDisplay.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        const img = document.createElement('img');
        img.className = 'capa';
        img.src = game.cover;
        img.alt = `Capa do ${game.title}`;

        const gameDetails = document.createElement('div');
        gameDetails.className = 'game-details';

        const starIcon = document.createElement('div');
        starIcon.className = 'fas fa-star';
        starIcon.addEventListener('click', () => toggleFavorite(starIcon));
        
        const gameTitle = document.createElement('h2');
        gameTitle.className = 'game-title';
        gameTitle.textContent = game.title;

        const gamePrices = document.createElement('ul');
        gamePrices.className = 'game-prices';
        for (const [store, price] of Object.entries(game.prices)) {
            const li = document.createElement('li');
            li.textContent = `${store}: ${price}`;
            gamePrices.appendChild(li);
        }

        const { minPrice, minDay } = getMinPrice(game.priceHistory);
        const minPriceFixedLabel = document.createElement('h2');
        minPriceFixedLabel.className = 'min-price';
        minPriceFixedLabel.textContent = `Menor Preço dos Últimos 60 Dias: R$ ${minPrice.toFixed(2).replace('.', ',')} (${minDay} dias atrás)`;

        const priceHistory = document.createElement('div');
        priceHistory.className = 'price-history';
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        const sliderLabel = document.createElement('label');
        let days = 1; 
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 1;
        slider.max = 60;
        slider.value = slider.max-1; 
        slider.addEventListener('input', () => {
            days = slider.max - (slider.value-1);
            sliderLabel.textContent = 'Menor preço a: ' + days + ' dias'; 
            minPriceLabel.textContent = 'Preço: ' + game.priceHistory[`DaysAgo${days}`];
        });
        sliderLabel.textContent = 'Menor preço a : ' + (slider.max - slider.value) + ' dias';
        const minPriceLabel = document.createElement('h2');
        minPriceLabel.className = 'min-price';
        minPriceLabel.textContent = 'Preço: ' + game.priceHistory[`DaysAgo1`];
        
        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(minPriceLabel);       
        gameDetails.appendChild(gameTitle);
        gameDetails.appendChild(gamePrices);
        priceHistory.appendChild(minPriceFixedLabel);
        priceHistory.appendChild(minPriceLabel);
        priceHistory.appendChild(sliderContainer);
        imgContainer.appendChild(img);
        gameCard.appendChild(imgContainer);
        gameCard.appendChild(gameDetails);
        gameCard.appendChild(gameDetails);
        gameCard.appendChild(priceHistory);
        gameCard.appendChild(starIcon);
        resultado.appendChild(gameCard);
    });

    displayPagination();
}

function toggleFavorite(icon) {
    icon.classList.toggle('favorite');

    if (icon.classList.contains('favorite')) {
        document.getElementById('message-text').innerText = 'Jogo adicionado aos favoritos!';
        openModalWithAutoClose('Jogo adicionado aos favoritos!');
    } else {
        document.getElementById('message-text').innerText = 'Jogo adicionado aos favoritos!';
        openModalWithAutoClose('Jogo removido dos favoritos!');
    }
}



function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(games.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.className = i === currentPage ? 'active' : '';

        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayGames(currentPage);
        });

        pagination.appendChild(pageLink);
    }
}

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = document.getElementById('nome-jogo').value.toLowerCase();
    const filteredGames = games.filter(game => game.title.toLowerCase().includes(searchQuery));
    
    if (filteredGames.length > 0) {
        games.length = 0;
        games.push(...filteredGames);
        currentPage = 1; 
        displayGames(currentPage);
    } else {
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = '<p>Nenhum jogo encontrado.</p>';
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
    }
});



displayGames(currentPage);


