import React from "react";
import axios from 'axios';
import "./MovieApp.css";
import { MdOutlineSearch } from "react-icons/md";

export default function MovieApp() {

    const [movies, setMovies] = React.useState([]);
    const [seachQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("popularity.desc");
    const [selectedGenre, setSelectedGenre] = React.useState("");
    const [genres, setGenres] = React.useState([]);
    const [expandedMovieId, setExpandedMovieId] = React.useState(null);

    React.useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                    api_key: '319f3b50d3e5b5c2abe950c46bbe001b',
                    sort_by: sortBy,
                    page: 1,
                    with_genres: selectedGenre,
                    query: seachQuery
                }
            });
            setMovies(response.data.results);
        }
        fetchMovies();
    }, [seachQuery,sortBy, selectedGenre]);

    React.useEffect(() => {
        const fetchGenres = async () => {
            const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
                params: {
                    api_key: '319f3b50d3e5b5c2abe950c46bbe001b'
                }
            });
            setGenres(response.data.genres);
        }
        fetchGenres();
    }, []);

    const hanleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }
    
    const handleSearchSubmit = async() => {
        const respone = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: '319f3b50d3e5b5c2abe950c46bbe001b',
                query: seachQuery
            }
        });
        setMovies(respone.data.results);
        console.log(respone.data.results);  
    }

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    }

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    }

    const toggleMovieDetails = (movieId) => {
        if (expandedMovieId === movieId) {
            setExpandedMovieId(null);
        } else {
            setExpandedMovieId(movieId);
        }
    }



    return (
        <div>
        <h1>Movie App</h1>
        <div className="search-bar">
            <input type="text" placeholder="Search for a movie..." value={seachQuery} onChange={hanleSearchChange} className="search-input" />
            <button onClick={handleSearchSubmit} className="search-button"><MdOutlineSearch /></button>
        </div>
        <div className="filters">
            <label htmlFor="sort-by">Sort by:</label>
            <select id = "sort-by" value={sortBy} onChange={handleSortChange}>
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Acsending</option>    
            <option value="release_date.desc">Release Date Descending</option>
            <option value="release_date.asc">Release Date Acsending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Acsending</option>
            </select>
            <label htmlFor="genre">Genre:</label>
            <select id="genre" value={selectedGenre} onChange={handleGenreChange} >
            <option value="">All Genres</option>
            {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
            </select>
        </div>
        <div className="movie-wrapper">
            {movies.map((movie) => (
                <div key={movie.id} className="movie">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <h2>{movie.title}</h2>
                    <p className="rating">Rating: {movie.vote_average}</p>
                    {expandedMovieId === movie.id ? (
                        <p>{movie.overview}</p>
                    ) : (
                        <p>{movie.overview.substring(0, 150)}...</p>
                    )}
                    <button onClick={() => toggleMovieDetails(movie.id)} className="read-more">
                        {expandedMovieId === movie.id ? "Show Less" : "Show More"}
                    </button>
                    <p className="release-date">Release Date: {movie.release_date}</p>
                </div>
            ))}
        </div>
        </div>
    );
    }
