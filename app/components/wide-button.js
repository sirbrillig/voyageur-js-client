import React from 'react';
export default ( props ) => <button className={ `btn btn-default btn-block ${props.className || ''}` } onClick={ props.onClick }>{ props.text }</button>;
