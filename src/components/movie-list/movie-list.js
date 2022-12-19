import PropTypes from 'prop-types'

import MovieItem from '../movie-item/movie-item'

import './movie-list.css'

export default function MovieList(props) {
  const { listPopularFilms, server } = props
  const m = listPopularFilms.map((movie) => {
    return <MovieItem key={movie.id} movie={movie} server={server} />
  })
  return <div className="movie-list">{m}</div>
}
MovieList.defaultProps = {
  listPopularFilms: [],
}

MovieList.propTypes = {
  listPopularFilms: PropTypes.arrayOf(PropTypes.objectOf),
}
