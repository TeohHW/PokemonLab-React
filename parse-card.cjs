const fs = require('fs');
const path = require('path');

// Points to your extracted "pokemon-tcg-data-master/cards/en" folder
const githubDataFolder = path.join(__dirname, 'pokemon-tcg-data-master', 'cards', 'en');
const setsMetadataPath = path.join(__dirname, 'pokemon-tcg-data-master', 'sets', 'en.json');
const jsonOutputPath = path.join(__dirname, 'public', 'expansions.json');

function compileAllWithWebImages() {
    console.log("⚙️ Compiling expansions.json using live image links...");
    let universalExpansionData = {};

    try {
        const files = fs.readdirSync(githubDataFolder);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        const setsRawData = fs.readFileSync(setsMetadataPath, 'utf8');
        const setsArray = JSON.parse(setsRawData);

        const setsById = {};
        setsArray.forEach(set => {
            setsById[set.id] = set;
});
        jsonFiles.forEach(file => {
            const setId = path.basename(file, '.json');
            const filePath = path.join(githubDataFolder, file);

            const rawData = fs.readFileSync(filePath, 'utf8');
            const cardsArray = JSON.parse(rawData);

            const setMetadata = setsById[setId];
            const setName = setMetadata?.name || setId;
            const setSeries = setMetadata?.series || 'Unknown Series';
            const setLogo = setMetadata?.images?.logo || '';
            const setSymbol = setMetadata?.images?.symbol || '';
            const releaseDate = setMetadata?.releaseDate || '';
            const releaseYear = releaseDate ? releaseDate.slice(0, 4) : '';
            console.log(`📦 Linking set: ${setName}`);

            universalExpansionData[setId] = {
                setId: setId,
                setName: setName,
                series: setSeries,
                releaseDate: releaseDate,
                releaseYear: releaseYear,
                logo: setLogo,
                symbol: setSymbol,
                commons: [],
                uncommons: [],
                rares: []
            };

            cardsArray.forEach(card => {
                const basicCardPayload = {
                    id: card.id,
                    name: card.name,
                    supertype: card.supertype || '',
                    subtypes: card.subtypes || [],
                    hp: card.hp || '',
                    types: card.types || [],
                    evolvesFrom: card.evolvesFrom || '',
                    abilities: card.abilities || [],
                    attacks: card.attacks || [],
                    rules: card.rules || [],
                    text: card.text || [],
                    weaknesses: card.weaknesses || [],
                    resistances: card.resistances || [],
                    retreatCost: card.retreatCost || [],
                    number: card.number || '',
                    artist: card.artist || '',
                    rarity: card.rarity || 'Common',
                    flavorText: card.flavorText || '',
                    legalities: card.legalities || {},
                    image: card.images.small,
                    largeImage: card.images.large || card.images.small
                };

                const cardRarity = card.rarity || 'Common';
                if (cardRarity === 'Common') {
                    universalExpansionData[setId].commons.push(basicCardPayload);
                } else if (cardRarity === 'Uncommon') {
                    universalExpansionData[setId].uncommons.push(basicCardPayload);
                } else {
                    universalExpansionData[setId].rares.push(basicCardPayload);
                }
            });
        });

        fs.writeFileSync(jsonOutputPath, JSON.stringify(universalExpansionData, null, 2));
        console.log("\n🎉 SUCCESS! expansions.json is ready with online image links!");

    } catch (error) {
        console.error("❌ Error parsing files:", error.message);
    }
}

compileAllWithWebImages();
