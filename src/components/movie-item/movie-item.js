import React from 'react'
import './movie-item.css'
import { Rate } from 'antd'

import { C } from '../genre-context/genre-context'

export default class MovieItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userRate: props.movie.rating }
  }

  onChangeRate = async (rate, id) => {
    const { server } = this.props
    let loadOnServer
    if (rate) {
      loadOnServer = await server.setRateMovie(id, rate)
    } else {
      loadOnServer = await server.deleteRateMovie(id)
    }
    if (loadOnServer) {
      this.setState({ userRate: rate })
    }
  }

  getColorRate = (rate) => {
    if (rate >= 7) return '#66E900'
    if (rate < 3) return '#E90000'
    if (rate >= 3 && rate < 5) return '#E97E00'
    return '#E9D100'
  }

  reductionOverview = (text) => {
    let length
    if (window.screen.availWidth > 400) length = 200
    if (window.screen.availWidth < 550) length = 100

    return `${text.slice(0, text.indexOf(' ', length))}...`
  }

  render() {
    const {
      movie: { genresId, id, overview, title, rate, release, image },
    } = this.props

    const { userRate } = this.state

    const genresName = genresId.map((idx) => <Genre key={idx} idx={idx} />)
    const rateStyle = {
      border: `2px solid ${this.getColorRate(rate)}`,
    }

    return (
      <div key={id} className="movie">
        <img className="movie__image" src={image} alt="poster" height="281" width="183" />
        <div className="movie__tittle-wrapper">
          <h3 className="movie__tittle">{title}</h3>
          <div className="movie__rate" style={rateStyle}>
            {rate}
          </div>
        </div>
        <div className="movie__release">{release}</div>
        <div className="movie__genres-wrapper">{genresName}</div>
        <div className="movie__footer">
          <p className="movie__overview">{this.reductionOverview(overview)}</p>
          <div className="movie__stars">
            <Rate key={id} count={10} value={userRate} allowHalf onChange={(rates) => this.onChangeRate(rates, id)} />
          </div>
        </div>
      </div>
    )
  }
}

function Genre(props) {
  return (
    <C>
      {(genres) => {
        const { idx } = props
        const oneGenre = genres.find((genre) => genre.id === idx)
        return (
          <div className="movie__genre" key={oneGenre.id}>
            {oneGenre.name}
          </div>
        )
      }}
    </C>
  )
}
