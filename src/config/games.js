// games.js

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

function generatePriceHistory() {
    const history = {};
    for (let i = 1; i <= 60; i++) {
        history[`DaysAgo${i}`] = `R$ ${(Math.random() * 200 + 20).toFixed(2)}`;
    }
    return history;
}

export { games };
