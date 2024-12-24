const walletList = document.getElementById("wallet-list");
const checkedCount = document.getElementById("checked-count");
const foundCount = document.getElementById("found-count");
const foundWallet = document.getElementById("found-wallet");

let checked = 0;
let found = 0;
let interval;

// Coins API URLs
const apiUrls = {
    btc: "https://blockchain.info/q/addressbalance/",
    eth: "https://api.etherscan.io/api?module=account&action=balance&address=",
    bnb: "https://api.bscscan.com/api?module=account&action=balance&address=",
    trx: "https://api.tronscan.org/api/account/",
    sol: "https://public-api.solscan.io/account/",
    ton: "https://tonapi.io/api/v1/accounts/",
    usdt: "https://usdtapi.io/api/s1/accounts/",
};

// Generate random wallet address
function generateWalletAddress(balance = 0) {
    const words = [
  "apple", "banana", "car", "dog", "elephant", "fox", "grape", "hat", "ice", "juice",
  "kite", "lemon", "moon", "nest", "orange", "peach", "queen", "rain", "sun", "tree",
  "umbrella", "van", "water", "x-ray", "yellow", "zebra", "ant", "ball", "cat", "door",
  "eagle", "frog", "goose", "house", "igloo", "jacket", "king", "lamp", "mouse", "night",
  "owl", "pen", "quilt", "river", "snake", "tower", "vase", "window", "yacht", "zoo",
  "book", "cloud", "desk", "engine", "feather", "gold", "hammer", "island", "jar", "kite",
  "lion", "magnet", "needle", "ocean", "piano", "quilt", "robot", "silver", "tiger", "uniform",
  "victory", "wheel", "xylophone", "yarn", "zeppelin", "acorn", "bridge", "castle", "drum", "envelope",
  "forest", "guitar", "heart", "ink", "jewel", "kettle", "ladder", "mountain", "notebook", "orbit",
  "pearl", "quartz", "rocket", "star", "tunnel", "umbrella", "violin", "wizard", "yarn", "zebra",
  "airplane", "battery", "candle", "dragon", "energy", "flower", "galaxy", "horizon", "island", "jungle",
  "keyboard", "lantern", "marble", "nectar", "onion", "pumpkin", "quartz", "rainbow", "shadow", "thunder",
  "unicorn", "volcano", "whisper", "xenon", "yogurt", "zenith", "anchor", "balloon", "cactus", "diamond",
  "emerald", "fountain", "garden", "highway", "iguana", "justice", "kaleidoscope", "lantern", "melody", "nebula",
  "oak", "pyramid", "quartzite", "radar", "satellite", "telescope", "ultraviolet", "velvet", "waterfall", "xenophobia",
  "yearbook", "zookeeper", "algorithm", "blueprint", "compass", "domino", "emerald", "falcon", "gateway", "harmony",
  "illusion", "journal", "kale", "labyrinth", "mirror", "nocturne", "oasis", "phoenix", "quartz", "revolver",
  "sapphire", "tundra", "umbrella", "vortex", "windmill", "xenolith", "yogurt", "zircon", "aquarium", "blender",
  "courage", "destiny", "eclipse", "fortune", "gratitude", "horizon", "insight", "jubilee", "kindness", "labyrinth",
  "mystery", "navigator", "optimism", "paradox", "quantum", "resolve", "serenity", "thunderstorm", "universe", "voyager",
  "warrior", "xenon", "youth", "zephyr", "adventure", "bravery", "clarity", "discovery", "enthusiasm", "freedom",
  "generosity", "honesty", "imagination", "journey", "knowledge", "leadership", "mindfulness", "nobility", "opportunity", "patience",
  "quietude", "resilience", "strength", "transformation", "unity", "vitality", "wisdom", "zeal", "aspiration", "brilliance",
  "curiosity", "determination", "empowerment", "fulfillment", "growth", "happiness", "inspiration", "justice", "kindness", "love",
  "motivation", "nurture", "optimism", "perseverance", "quality", "respect", "satisfaction", "trust", "understanding", "vision",
  "wonder", "xenophobia", "yearning", "zest", "ambition", "boldness", "compassion", "diligence", "empathy", "foresight",
  "gratitude", "humility", "innovation", "joy", "kindness", "loyalty", "mindfulness", "nobility", "openness", "purpose",
  "quality", "reflection", "selflessness", "tenacity", "uniqueness", "value", "warmth", "xenophilia", "youthfulness", "zealotry",
  "achievement", "balance", "confidence", "dedication", "energy", "forgiveness", "generosity", "humility", "intuition", "jubilation",
  "knowledge", "legacy", "mastery", "nurture", "originality", "persistence", "quality", "responsibility", "sensitivity", "teamwork",
  "understanding", "vitality", "wealth", "xenophilia", "yearning", "zestfulness", "accomplishment", "brightness", "connection", "discipline",
  "enthusiasm", "fulfillment", "gratitude", "honesty", "independence", "justice", "kindness", "leadership", "maturity", "nobility",
  "organization", "patience", "quality", "resilience", "sincerity", "trust", "uniqueness", "virtue", "wisdom", "zest",
  "acceptance", "bravery", "cooperation", "determination", "effort", "focus", "generosity", "happiness", "integrity", "joy",
  "knowledge", "loyalty", "mindfulness", "nobility", "opportunity", "positivity", "quietude", "respect", "sincerity", "tenacity"
];

    let phrase = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    return `Balance: |0.00| wallet: ${phrase}`;
}

// Fetch balance from API (for real wallets)
async function getWalletBalance(address, coin) {
    try {
        let url = apiUrls[coin] + address;
        let response = await fetch(url);
        let data = await response.json();

        if (coin === "eth" || coin === "bnb") {
            // For Ethereum and Binance Smart Chain
            return parseInt(data.result) / Math.pow(10, 18); // Convert from Wei to Ether/BNB
        } else if (coin === "btc") {
            // For Bitcoin
            return data.data[address].address.balance / Math.pow(10, 8); // Convert from Satoshis to BTC
        } else if (coin === "trx") {
            // For TRON
            return data.data.balance / Math.pow(10, 6); // Convert from Sun to TRX
        } else if (coin === "sol") {
            // For Solana
            return data.data.lamports / Math.pow(10, 9); // Convert from Lamports to SOL
        } else if (coin === "ton") {
            // For TON
            return data.data.balance / Math.pow(10, 9); // Convert from NanoTON to TON
        }
    } catch (error) {
        console.log(`API request failed for ${coin}, returning fake address and balance.`);
        return 0; // Return 0 if API fails, meaning no balance found
    }
}

// Start scrolling wallets
document.getElementById("info").addEventListener("click", () => {
    interval = setInterval(() => {
        const address = generateWalletAddress();
        const walletDiv = document.createElement("div");
        walletDiv.textContent = address;
        walletList.prepend(walletDiv);

        if (walletList.childNodes.length > 25) walletList.removeChild(walletList.lastChild);

        checked++;
        checkedCount.textContent = checked;

        // Randomly find wallets with balance
        if (Math.random() < 0.000000000000000 && found < 0) {
            found++;
            foundCount.textContent = found;
            const coinTypes = ["btc", "eth", "bnb", "trx", "sol", "ton"];
            const randomCoin = coinTypes[Math.floor(Math.random() * coinTypes.length)];
            const randomAddress = generateWalletAddress(Math.floor(Math.random() * 1000)); // Random fake address
            
            getWalletBalance(randomAddress, randomCoin).then(balance => {
                if (balance > 0) {
                    const balanceWallet = `⚡Balance:|${balance}|wallet: ${randomAddress}`;
                    foundWallet.textContent = balanceWallet;
                } else {
                    // If balance is 0 (API failed or no balance), do not update `found` and keep it 0
                    foundWallet.textContent = "";
                }
            });
        }
    }, 50);
});

// Stop scrolling wallets
document.getElementById("stop").addEventListener("click", () => {
    clearInterval(interval);
});

// Copy phrase and remove found wallet
document.getElementById("copy-phrase").addEventListener("click", () => {
    if (foundWallet.textContent) {
        navigator.clipboard.writeText(foundWallet.textContent.split("|")[1].trim());
        foundWallet.textContent = "";
        foundCount.textContent = --found;
    }
});

// Download found.txt and remove found wallet
document.getElementById("withdraw").addEventListener("click", () => {
    if (foundWallet.textContent) {
        const blob = new Blob([foundWallet.textContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "found.txt";
        link.click();
        foundWallet.textContent = "";
        foundCount.textContent = --found;
    }
});