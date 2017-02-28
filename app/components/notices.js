import React from 'react';

function reloadPage() {
  if ( typeof window !== 'undefined' ) window.location.reload();
}

const ErrorNotice = ( { error, key } ) => {
  return <div key={ 'notices__error__' + key } className="notices__notice alert alert-warning" role="alert">{ error }</div>;
};

ErrorNotice.propTypes = {
  error: React.PropTypes.string.isRequired,
  key: React.PropTypes.number.isRequired,
};

const Notices = ( { errors, onClearNotices } ) => {
  if ( ! errors || errors.length === 0 ) return null;
  return (
    <div className="notices well">
      <h1 className="notices__title">Sorry! Something went wrong!</h1>
      <div className="notices__help">
        <p>If the problem was temporary, you can try to keep working. Otherwise you can try to reload and see if that helps.</p>
        <p>If you keep seeing errors, send an email to <a className="label label-primary" href="mailto:payton+voyageurhelp@foolord.com">payton+voyageurhelp@foolord.com</a> and I'll see what I can do.</p>
      </div>
      <div className="notices__buttons">
        <button className="notices__clear btn btn-block btn-primary" onClick={ onClearNotices }>keep going</button>
        <button className="notices__reload btn btn-block btn-warning" onClick={ reloadPage }>try reloading</button>
      </div>
      <div className="notices__errors">
        <div className="notices__help">
          <h3 className="notices__help__title">Here's the raw error I saw:</h3>
          <p>Don't worry if you don't understand it; if it keeps happening just send it to me in an email.</p>
        </div>
        { errors.map( ( error, key ) => <ErrorNotice error={ error } key={ key } /> ) }
      </div>
    </div>
  );
};

Notices.propTypes = {
  errors: React.PropTypes.array,
  onClearNotices: React.PropTypes.func.isRequired,
};

export default Notices;
