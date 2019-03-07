import React from 'react';

const SkipToContent = ( props ) => {
  const focusTarget = props.target.focus();
  return <button className="skip-to-content" onClick={ focusTarget }>Skip To Content</button>;
};

export default SkipToContent;
