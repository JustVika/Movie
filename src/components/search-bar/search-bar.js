import React from 'react'
import debounce from 'lodash.debounce'
import './search-bar.css'
import PropTypes from 'prop-types'

export default class SearchBar extends React.Component {
  onChangeSearch = (event) => {
    const { search } = this.props
    const label = event.target.value
    search(label)
  }

  render() {
    return (
      <div className="Search">
        <input
          className="Search__input"
          type="text"
          placeholder="Type to search..."
          onChange={debounce(this.onChangeSearch, 1000)}
        />
      </div>
    )
  }
}
SearchBar.defaultProps = {
  search: () => {},
}

SearchBar.propTypes = {
  search: PropTypes.func,
}
