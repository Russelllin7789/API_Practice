import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMovieData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    // 1. traditional way to get data via API
    // fetch('https://swapi.dev/api/films')
    //   // *** fetch will return a promise json file ***
    //   .then((response) => {
    //     return response.json()
    //   })
    //   .then((data) => {
    //     const transformedMovies = data.results.map((movieData) => {
    //       return {
    //         id: movieData.episode_id,
    //         title: movieData.title,
    //         openingText: movieData.opening_crawl,
    //         releaseDate: movieData.release_date
    //       }
    //     })

    //     setMovies(transformedMovies)
    //   })

    // 2. async and await
    try {
      const response = await fetch('https://react-api-392b9-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json')
      // *** fetch won't generate error by itself ***
      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      const data = await response.json()

      const loadedMovies = []

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      setMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMovieData()
  }, [fetchMovieData])

  let content = <p>Found no movies.</p>
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }
  if (error) {
    content = <p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
  }

  const addMovieHandler = async (movie) => {
    const response = await fetch('https://react-api-392b9-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log('data after fetch POST:', data)
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieData}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
