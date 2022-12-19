import format from 'date-fns/format'

import notPoser from './image/poster.jpg'

export default class MovieServices {
  constructor() {
    this.sessionId = ''
    this.key = 'b316f5d8cfc2fa37e7086b71b0e51b64'
    this.guestRate = new Map()
  }

  mostPopularMovie = async (page = 1) => {
    try {
      const resMovie = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.key}&language=en-US&page=${page}`
      )
      const bodyMovie = await resMovie.json()
      return this.listMovies(bodyMovie)
    } catch (err) {
      return err.message
    }
  }

  searchMovies = async (request, page = 1) => {
    const resMovie = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.key}&language=en-US&query=${request}&page=${page}&include_adult=false`
    )
    const bodyMovie = await resMovie.json()
    const no = this.listMovies(bodyMovie)
    return no
  }

  guestListRate = async () => {
    try {
      const resMovie = await fetch(
        `https://api.themoviedb.org/3/guest_session/${this.sessionId}/rated/movies?api_key=${this.key}&language=en-US&sort_by=created_at.asc`
      )
      const bodyMovie = await resMovie.json()
      bodyMovie.results.forEach((elem) => {
        this.guestRate.set(elem.id, elem.rating)
      })
      return this.listMovies(bodyMovie)
    } catch (err) {
      return err.message
    }
  }

  listMovies = (bodyMovie) => {
    const countMovies = bodyMovie.total_results
    const body = this.transformMovies(bodyMovie.results)
    return { movies: body, countMovies }
  }

  genreList = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.key}`)
      const body = await res.json()
      return body.genres
    } catch (err) {
      return err.message
    }
  }

  transformMovie = (movie) => {
    const newMovie = {}
    newMovie.rating = this.guestRate.get(movie.id) ? this.guestRate.get(movie.id) : 0
    newMovie.genresId = movie.genre_ids
    newMovie.id = movie.id
    newMovie.overview = movie.overview
    newMovie.title = movie.title
    newMovie.rate = movie.vote_average.toFixed(1)
    const q = ', '
    newMovie.release = movie.release_date
      ? format(new Date(movie.release_date), `MMMM d${q}  yyyy`)
      : 'October 19, 2022'
    newMovie.image = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : `${notPoser}`

    return newMovie
  }

  transformMovies = (listMovie) => {
    const list = listMovie.map((movie) => {
      return this.transformMovie(movie)
    })

    return list
  }

  setRateMovie = async (id, rate) => {
    const body = {
      value: rate,
    }
    try {
      await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.key}&guest_session_id=${this.sessionId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
          body: JSON.stringify(body),
        }
      )
      this.guestRate.set(id, rate)
      return true
    } catch (err) {
      return err.message
    }
  }

  deleteRateMovie = async (id) => {
    try {
      await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.key}&guest_session_id=${this.sessionId}`,
        {
          method: 'DELETE',
          'Content-Type': 'application/json;charset=utf-8',
        }
      )
      this.guestRate.delete(id)
      return true
    } catch (err) {
      return err.message
    }
  }

  createSession = async () => {
    if (sessionStorage.getItem('id')) {
      this.sessionId = sessionStorage.getItem('id')
      await this.guestListRate()
      return true
    }
    try {
      const res = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.key}`)
      const body = await res.json()
      this.sessionId = body.guest_session_id
      sessionStorage.setItem('id', this.sessionId)
      return true
    } catch (err) {
      return err.message
    }
  }
}
