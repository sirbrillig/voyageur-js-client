import React from 'react';

class LocationSearch extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { searchString: '' };
    this.searchKeyListener = this.searchKeyListener.bind( this );
    this.clearSearch = this.clearSearch.bind( this );
    this.focusSearchField = this.focusSearchField.bind( this );
    this.onChange = this.onChange.bind( this );
  }

  componentDidMount() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keyup', this.searchKeyListener );
  }

  componentWillUnmount() {
    if ( ! window ) return;
    window.document.body.removeEventListener( 'keyup', this.searchKeyListener );
  }

  searchKeyListener( evt ) {
    // pressing forward slash focuses the search field
    if ( evt.keyCode === 191 ) this.focusSearchField();
    // pressing escape clears the search field
    if ( evt.keyCode === 27 ) this.clearSearch();
    // pressing enter also clears the search (after adding takes place)
    if ( evt.keyCode === 13 ) this.clearSearch();
  }

  clearSearch() {
    this.setState( { searchString: '' } );
    this.props.onChange( '' );
  }

  focusSearchField() {
    if ( this.searchField ) this.searchField.focus();
  }

  onChange( value ) {
    this.setState( { searchString: value }, () => {
      this.props.onChange( this.state.searchString );
    } );
  }

  render() {
    const inputWasMounted = ( searchField ) => this.searchField = searchField;
    const onChange = event => this.onChange( event.target.value );
    return (
      <div className="location-search">
        <input ref={ inputWasMounted } value={ this.state.searchString } className="form-control" type="text" placeholder="Search" onChange={ onChange } />
        <div className="location-search__help alert">Press '/' to Search, up/down to select, 'enter' to add, shift-esc to clear trip.</div>
      </div>
    );
  }
}

LocationSearch.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};

export default LocationSearch;
