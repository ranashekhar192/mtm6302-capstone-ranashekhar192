document.addEventListener('DOMContentLoaded', () => {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const loadMoreBtn = document.getElementById('load-more');
    let nextPageUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    const capturedPokemon = JSON.parse(localStorage.getItem('capturedPokemon')) || [];

    // Function to parse Pokémon ID from URL
    function extractIdFromUrl(url) {
        return url.split('/').filter(Boolean).pop();
    }

    // Function to load Pokémon data
    async function fetchPokemonData(url) {
        const response = await fetch(url);
        const data = await response.json();
        nextPageUrl = data.next;
        data.results.forEach(pokemon => renderPokemonCard(pokemon));
    }

    // Function to add Pokémon to gallery
    async function renderPokemonCard(pokemon) {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png" alt="${pokemon.name}">
            <h5>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h5>
            <button class="btn btn-secondary btn-sm catch-release">${capturedPokemon.includes(details.id) ? 'Release' : 'Catch'}</button>
        `;

        pokemonCard.querySelector('img').addEventListener('click', () => displayPokemonDetails(details));
        pokemonCard.querySelector('.catch-release').addEventListener('click', () => handleCatchRelease(details.id, pokemonCard));

        if (capturedPokemon.includes(details.id)) {
            pokemonCard.classList.add('caught');
        }

        pokemonGallery.appendChild(pokemonCard);
    }

    // Function to show Pokémon details
    function displayPokemonDetails(details) {
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'pokemon-details';
        detailsDiv.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png" alt="${details.name}">
            <h5>${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</h5>
            <p>Abilities: ${details.abilities.map(a => a.ability.name).join(', ')}</p>
            <p>Types: ${details.types.map(t => t.type.name).join(', ')}</p>
        `;
        document.body.appendChild(detailsDiv);
    }

    // Function to toggle catch/release Pokémon
    function handleCatchRelease(id, card) {
        const index = capturedPokemon.indexOf(id);
        if (index > -1) {
            capturedPokemon.splice(index, 1);
            card.classList.remove('caught');
            card.querySelector('.catch-release').textContent = 'Catch';
        } else {
            capturedPokemon.push(id);
            card.classList.add('caught');
            card.querySelector('.catch-release').textContent = 'Release';
        }
        localStorage.setItem('capturedPokemon', JSON.stringify(capturedPokemon));
    }

    // Load initial Pokémon data
    fetchPokemonData(nextPageUrl);

    // Load more Pokémon on button click
    loadMoreBtn.addEventListener('click', () => fetchPokemonData(nextPageUrl));
});
