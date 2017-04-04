import React, { Component } from 'react';

class AddMedianizerForm extends Component {
  addMedianizer(e) {
    e.preventDefault();
    const medianizer = {
      address: this.address.value,
      length: 0
    }
    this.props.addMedianizer(medianizer);
    this.medianizerForm.reset();
  }

  render() {
    return (
      <form ref={(input) => this.medianizerForm = input} onSubmit={(e) => this.addMedianizer(e)}>
        <input ref={(input) => this.address = input} type="text" placeholder="Medianizer address" required />
        <button>Add existing Medianizer</button>
      </form>
    );
  }
}

export default AddMedianizerForm;
