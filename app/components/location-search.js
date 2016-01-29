import React from 'react';

export default React.createClass( {
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    onClearSearch: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      searchString: ''
    };
  },

  componentDidMount() {
    if ( ! window ) return;
    window.document.body.addEventListener( 'keyup', ( evt ) => {
      // pressing forward slash focuses the search field
      if ( evt.keyCode === 191 ) this.focusSearchField();
      // pressing escape clears the search field
      if ( evt.keyCode === 27 ) this.clearSearch();
      // pressing enter also clears the search (after adding takes place)
      if ( evt.keyCode === 13 ) this.clearSearch();
    } );
  },

  clearSearch() {
    this.setState( { searchString: '' } );
    this.props.onClearSearch();
  },

  focusSearchField() {
    if ( this.searchField ) this.searchField.focus();
  },

  onChange( value ) {
    this.setState( { searchString: value }, () => {
      this.props.onChange( this.state.searchString );
    } );
  },

  inputWasMounted( searchField ) {
    this.searchField = searchField;
  },

  render() {
    return <div className="location-search"><input ref={ this.inputWasMounted } value={ this.state.searchString } className="form-control" type="text" placeholder="Search" onChange={ event => this.onChange( event.target.value ) } /></div>;
  }
} );

