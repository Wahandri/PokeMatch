import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokeCard.css';
import pokeball from "../../images/pokebola.png"

const PokeCard = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokeCardMessage, setPokeCardMessage] = useState('');
  const [powerMatch, setPowerMatch] = useState(0);
  const [pokeLevel, setPokeLevel] = useState(0); 
  const [pokeList, setPokeList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  // Obtener un Pokémon aleatorio entre el 1 y el 300
  const obtenerPokemonAleatorio = () => {
    const pokemonId = Math.floor(Math.random() * 150) + 1;
    setPokeLevel(Math.floor(Math.random() * 80) + 1);
    return pokemonId;
  };

  // Cargar los datos de un Pokémon aleatorio
  const loadPokemon = async () => {
    const pokemonId = obtenerPokemonAleatorio();
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      setPokemonData(response.data);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar el Pokémon:', error);
    }
  };

  // Cargar un Pokémon aleatorio al montar el componente
  useEffect(() => {
    loadPokemon();
  }, []);

  // Función para manejar el clic del botón "Siguiente"
  const handleNext = () => {
    loadPokemon();
    setPokeCardMessage('');
  };

  // Botón "Intentar Match"
  const handleMatch = async () => {
    const matchPower = Math.floor(Math.random() * 100) + 1;
    setPowerMatch(matchPower);

    if (matchPower > pokeLevel) {
      const isNewPokemon = pokeList.every(poke => poke.id !== pokemonData.id);
      if (isNewPokemon) {
        setPokeCardMessage(`${pokemonData.name} nivel ${pokeLevel} ha sido capturado.`);
        setPokeList([...pokeList, pokemonData]);
        setPokeList(pokeList => pokeList.sort((a, b) => a.id - b.id));

        setTimeout(() => {
          setIsHappy(true); // Establecer como feliz si se captura un pokémon
        }, 1000);
        // loadPokemon();
      } else {
        setPokeCardMessage(`${pokemonData.name} ya está en la lista.`);
        // loadPokemon();
      }
    } else {
      setPokeCardMessage(`${pokemonData.name} nivel ${pokeLevel} ha huido.`);
    }

    await loadPokemon();
  };

  return (
    <>
      <div className={`poke-card ${isAnimating ? 'shrink' : ''} ${pokeCardMessage ? 'fade-out' : ''} ${isHappy ? 'happy-animation' : ''}`}>
        {pokemonData ? (
          <>
            <div >
              {pokeList.some(poke => poke.id === pokemonData.id) ? (
                <img className='imgPokeball' width="30px" src={pokeball} alt="pokeball" />
              ) : <img className='imgPokeballEmpy' width="30px" src={pokeball} alt="pokeball" />}
            </div>
            <h2>{pokemonData.name}</h2>
            <p>Nivel: {pokeLevel}</p> 
            <img className='imgPokemon' src={pokemonData.sprites.front_default} alt={pokemonData.name} />
            <div className="buttons">
              <button onClick={handleNext}>Siguiente</button>
              <button onClick={handleMatch}>Intentar Match</button>
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <h3>
        <p>{pokeCardMessage}</p>
      </h3>
      <div>
        <h1>Pokedex</h1>
        <p>{pokeList.length}</p>
        <ul className='listPokemon'>
          {pokeList.map((poke, index) => (
            <li className='pokeLi' key={index}>
              <img className='imgPokemonList' src={poke.sprites.front_default} alt={poke.name} />
              <p>{poke.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PokeCard;
