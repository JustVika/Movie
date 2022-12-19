import './App.css'
import React from 'react'
import { Spin, Pagination, Alert } from 'antd'

import MovieServices from './services'
import MovieList from './components/movie-list/movie-list'
import AppHeader from './components/app-header/app-header'
import { P } from './components/genre-context/genre-context'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      moviesList: [],
      loading: true,
      countMovies: 0,
      currentPage: 1,
      searchLine: '',
      error: false,
      tab: '1',
    }
    this.server = new MovieServices()
    this.genres = []
  }

  componentDidMount() {
    this.createSession()
    this.getGenre()
  }

  createSession = async () => {
    try {
      await this.server.createSession()
      await this.getMovies()
    } catch {
      this.setState({ error: true, loading: false })
    }
  }

  onChangePage = async (page) => {
    const { searchLine } = this.state
    if (page === this.currentPage) return false
    await this.getMovies(page, searchLine)
    return true
  }

  addMoviesList = ({ movies, countMovies }) => {
    const count = countMovies > 10000 ? 10000 : countMovies
    this.setState({
      moviesList: [...movies],
      loading: false,
      countMovies: count,
    })
  }

  searchMovies = (label) => {
    this.getMovies(this.currentPage, label)
  }

  getMovies = async (page = 1, label = '') => {
    this.setState({
      loading: true,
      countMovies: 0,
      currentPage: page,
      searchLine: label,
      error: false,
    })
    let moviesList
    if (!label.trimStart()) {
      try {
        moviesList = await this.server.mostPopularMovie(page)
        this.addMoviesList(moviesList)
      } catch {
        this.setState({ error: true, loading: false })
      }
    } else {
      moviesList = await this.server.searchMovies(label, page)
      this.addMoviesList(moviesList)
    }
  }

  getMoviesRate = async () => {
    try {
      const moviesList = await this.server.guestListRate()
      this.addMoviesList(moviesList)
      return true
    } catch (err) {
      return err.message
    }
  }

  getGenre = async () => {
    this.genres = await this.server.genreList()
  }

  changeTab = (key) => {
    if (key === this.tab) return false
    this.setState({
      tab: key,
      loading: true,
      error: false,
      countMovies: 0,
    })
    if (key === '2') this.getMoviesRate()
    else this.getMovies()
    return true
  }

  render() {
    const { moviesList, countMovies, currentPage, error, loading, tab } = this.state
    const errorMessage = error ? (
      <Alert message="Что-то полшо не так. Скорей всего у вас выключен vpn или интернет " type="error" />
    ) : null
    const load = loading ? <Spin size="large" /> : null

    const notFound =
      tab === '1' ? (
        <Alert message=" Фильмов по вашему запросу не найдено " type="info" />
      ) : (
        <Alert message=" Вы еще не оценили ни одного фильма " type="info" />
      )

    const hasIsContent = moviesList.length ? (
      <P value={this.genres}>
        <MovieList listPopularFilms={moviesList} server={this.server} />
      </P>
    ) : (
      notFound
    )

    const content = !(loading || error) ? hasIsContent : null

    return (
      <section className="moviesWrapper">
        <AppHeader search={this.searchMovies} changeTab={this.changeTab} currentTab={tab} />
        {load}
        {content}
        {errorMessage}
        <Pagination
          current={currentPage}
          total={countMovies}
          hideOnSinglePage
          defaultPageSize={20}
          showSizeChanger={false}
          onChange={this.onChangePage}
        />
      </section>
    )
  }
}
