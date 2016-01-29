export function gotError( error ) {
  return { type: 'ERROR', error };
}

export function clearNotices() {
  return { type: 'NOTICES_CLEAR' };
}
