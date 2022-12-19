import PropTypes from 'prop-types'
import { Tabs } from 'antd'

import SearchBar from '../search-bar/search-bar'

import './app-header.css'

export default function AppHeader(props) {
  const { search, changeTab, currentTab } = props
  const hasSearch = currentTab === '1' ? <SearchBar search={search} /> : null
  return (
    <header className="header">
      <Tabs
        className="header__tab"
        defaultActiveKey="1"
        onChange={changeTab}
        items={[
          {
            label: 'Search',
            key: '1',
          },
          {
            label: 'Rated',
            key: '2',
          },
        ]}
      />
      {hasSearch}
    </header>
  )
}
AppHeader.defaultProps = {
  search: () => {},
  changeTab: () => {},
  currentTab: '1',
}

AppHeader.propTypes = {
  search: PropTypes.func,
  changeTab: PropTypes.func,
  currentTab: PropTypes.string,
}
