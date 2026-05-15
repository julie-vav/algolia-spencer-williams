import ResultsPage from './components/results-page';

// Main application entry point — initializes the Spencer & Williams search experience
class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
  }

  // Creates a new ResultsPage instance to set up search
  _initSearch() {
    this.resultPage = new ResultsPage();
  }
}

const app = new SpencerAndWilliamsSearch();