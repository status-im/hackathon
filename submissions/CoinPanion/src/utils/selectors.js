import { createSelector } from 'reselect'

const searchResults = state => state.search.results

export const searchResultsForPopup = createSelector(searchResults, results =>
  Object.keys(results).map(key => ({
    text: `${results[key].first_name} ${results[key].last_name}`,
    value: results[key]
  }))
)
