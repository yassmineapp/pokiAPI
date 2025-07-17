const pokemonList = document.getElementById('pokemon-list');
    const pokemonDetails = document.getElementById('pokemon-details');
    const searchInput = document.getElementById('searchInput');

    let allPokemons = [];
    let currentPage = 1;
    const perPage = 20;

    fetch('https://pokeapi.co/api/v2/pokemon?limit=200')
        .then(res => res.json())
        .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(res => res.json())
                    .then(details => {
                        allPokemons.push(details);
                        if (allPokemons.length <= perPage) displayPokemon(details);
                    });
            });
        });

    function displayAll() {
        pokemonList.innerHTML = '';
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        allPokemons.slice(start, end).forEach(displayPokemon);
    }

    function displayPokemon(details) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${details.sprites.front_default}" alt="${details.name}">
            <h3>${details.name}</h3>
        `;
        card.onclick = () => showDetails(details);
        pokemonList.appendChild(card);
    }

    function filterPokemon() {
        const value = searchInput.value.toLowerCase();
        const filtered = allPokemons.filter(p => p.name.includes(value));
        pokemonList.innerHTML = '';
        filtered.forEach(displayPokemon);
    }

    function showDetails(details) {
        pokemonDetails.innerHTML = `
            <img src="${details.sprites.front_default}" alt="${details.name}">
            <h2>${details.name.toUpperCase()}</h2>
            <p><strong>ID:</strong> #${details.id}</p>
            <div>
                ${details.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join('')}
            </div>
            <p><strong>Height:</strong> ${details.height / 10} m</p>
            <p><strong>Weight:</strong> ${details.weight / 10} kg</p>
            <p><strong>Base Experience:</strong> ${details.base_experience}</p>
        `;
    }

    function changePage(direction) {
        const totalPages = Math.ceil(allPokemons.length / perPage);
        currentPage += direction;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        displayAll();
    }