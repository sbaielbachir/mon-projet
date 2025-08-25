import { getPopularMovies } from "@/lib/api";
import InfiniteMovieScroller from "@/components/home/infinite-movie-scroller";

const PopularMoviesSection = async () => {
    const movies = await getPopularMovies();

    if (movies.length === 0) {
        return null; // Ne rien afficher si aucun film n'est trouvé
    }

    return (
        <section className="py-12 space-y-4">
            <h2 className="text-3xl font-bold text-center mb-6">Derniers Films et Séries Populaires</h2>
            <InfiniteMovieScroller movies={movies} direction="left" />
            <InfiniteMovieScroller movies={movies} direction="right" />
        </section>
    );
}

export default PopularMoviesSection;