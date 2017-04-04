import React from 'react';

const Medianizer = (props) => {
  const address = props.data.address;
  return (
    <div>
      <p>Medianizer at <b>{address}</b></p>
      <p>
        <button onClick={() => props.read(address)}>Read</button>
        <button onClick={() => props.next(address)}>Next</button>
        <button onClick={() => props.set(address)}>Set</button>
        <button onClick={() => props.remove(props.index)}>Remove this</button>
      </p>
      <br />
    </div>
  );
}

export default Medianizer;
