import React from 'react';

class LocationSearch extends React.Component {
  componentDidMount() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keyup', this.searchKeyListener );
  }

  componentWillUnmount() {
    if ( ! window ) return;
    window.document.body.removeEventListener( 'keyup', this.searchKeyListener );
  }

  searchKeyListener = ( evt ) => {
    if ( this.props.isShowingModal ) return;
    // pressing forward slash focuses the search field
    if ( evt.keyCode === 191 ) this.focusSearchField();
    // pressing escape clears the search field
    if ( evt.keyCode === 27 ) this.clearSearch();
  }

  clearSearch = () => {
    this.props.onChange( '' );
  }

  focusSearchField = () => {
    if ( this.searchField ) this.searchField.focus();
  }

  render() {
    const inputWasMounted = ( searchField ) => this.searchField = searchField;
    const onChange = event => this.props.onChange( event.target.value );
    return (
      <div className="location-search">
        <input ref={ inputWasMounted } value={ this.props.searchString } className="form-control" type="search" placeholder="Search" onChange={ onChange } />
        <div className="location-search__help alert">Press '/' to Search, up/down to select, 'enter' to add, shift-esc to clear trip.</div>
      </div>
    );
  }
}

LocationSearch.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  searchString: React.PropTypes.string,
  isShowingModal: React.PropTypes.bool,
};

export default LocationSearch;
