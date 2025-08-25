import { TmdbMovie } from '@/lib/types';
import MovieImage from './movie-image';

interface InfiniteMovieScrollerProps {
  movies: TmdbMovie[];
  direction?: 'left' | 'right';
}

const InfiniteMovieScroller = ({
  movies,
  direction = 'left',
}: InfiniteMovieScrollerProps) => {
  // Dupliquer les films pour un effet de boucle fluide
  const extendedMovies = [...movies, ...movies];
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
      <div
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${animationClass}`}
      >
        {extendedMovies.map((movie, idx) => (
          <div
            className="w-[300px] max-w-none relative"
            key={`${movie.id}-${idx}`}
          >
            <MovieImage
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={169}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMovieScroller;