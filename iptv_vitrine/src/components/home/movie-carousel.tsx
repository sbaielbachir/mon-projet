import { getPopularMovies } from '@/lib/api';
import { TmdbMovie } from '@/lib/types';
import MovieImage from './movie-image'; // Utilise le nouveau composant client

const MovieCarousel = async ({ title }: { title: string }) => {
  const movies = await getPopularMovies();

  if (movies.length === 0) {
    return (
        <div className="my-12">
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <p className="text-text-muted">Impossible de charger les films. Vérifiez votre clé API TMDB dans le fichier .env.local.</p>
        </div>
    );
  }

  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {movies.map((movie: TmdbMovie) => (
          <div key={movie.id} className="flex-shrink-0 w-48">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <MovieImage
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
               <div className="p-2">
                 <h3 className="text-sm font-semibold truncate text-white">{movie.title}</h3>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;