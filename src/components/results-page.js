import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, pagination, refinementList } from 'instantsearch.js/es/widgets';

// Handles all search functionality for the Spencer & Williams results page
class ResultPage {
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  // Initializes the Algolia search client and InstantSearch instance
  _registerClient() {
    this._searchClient = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_SEARCH_API_KEY
    );

    // Enable Insights for event tracking
    this._searchInstance = instantsearch({
      indexName: process.env.ALGOLIA_INDEX,
      searchClient: this._searchClient,
      insights: true,
    });

    // Set anonymous user token for demo purposes
    window.aa('setUserToken', 'anonymous-user');
  }

  // Adds search widgets to the InstantSearch instance
  _registerWidgets() {
    this._searchInstance.addWidgets([
      // Search input
      searchBox({
        container: '#searchbox',
      }),
      // Product results with click and conversion event tracking
      hits({
        container: '#hits',
        templates: {
          item(hit, { html, sendEvent, components }) {
            return html`
              <a class="result-hit">
                <div class="result-hit__image-container">
                  <img class="result-hit__image" src="${hit.image}" />
                </div>
                <div class="result-hit__details">
                  <h3 class="result-hit__name">${components.Highlight({ hit, attribute: 'name' })}</h3>
                  <p class="result-hit__price">$${hit.price}</p>
                </div>
                <div class="result-hit__controls">
                  <button
                    class="result-hit__view"
                    onClick="${() => {
                      sendEvent('click', hit, 'Hit Clicked');
                      window.open(hit.url, '_blank');
                    }}">
                    View
                  </button>
                  <button
                    class="result-hit__cart"
                    onClick="${() => sendEvent('conversion', hit, 'Added To Cart')}">
                    Add To Cart
                  </button>
                </div>
              </a>
            `;
          },
        },
      }),
      // Pagination controls
      pagination({
        container: '#pagination',
      }),
      // Brand filter
      refinementList({
        container: '#brand-facet',
        attribute: 'brand',
      }),
      // Category filter
      refinementList({
        container: '#categories-facet',
        attribute: 'categories',
      }),
    ]);
  }

  // Starts the InstantSearch instance after widgets are registered
  _startSearch() {
    this._searchInstance.start();
  }
}

export default ResultPage;