import React, { Component } from 'react';

class Medianizer extends Component {
  prod(e) {
    e.preventDefault();
    this.props.prod(this.props.data.address, this.zzz.value);
    this.form.reset();
  }

  render() {
    return (
      <div>
        <p>Medianizer at <b>{this.props.data.address}</b></p>
        <form ref={(input) => this.form = input} onSubmit={(e) => this.prod(e)}>
          <input ref={(input) => this.zzz = input} type="text" placeholder="Expiration (now plus N seconds)" required
          defaultValue={84000} />
          <button>Prod</button>
        </form>
        <p>
          <button onClick={() => this.props.read(this.props.data.address)}>Read</button>
          <button onClick={() => this.props.next(this.props.data.address)}>Next</button>
          <button onClick={() => this.props.set(this.props.data.address)}>Set</button>
          <button onClick={() => this.props.remove(this.props.index)}>Remove this</button>
        </p>
        <br />
      </div>
    );
  }
}

export default Medianizer;
