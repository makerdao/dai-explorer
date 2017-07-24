import React from 'react';
import vicon from '../video_icon.svg';
import ticon from '../terminology_icon.svg';

const ResourceButtons = (props) => {
  return (
    <span className="resourceButtons">
      <a className="resource video" href="#video" onClick={ props.handleOpenVideoModal }>
        <img src={ vicon } alt="Video Tutorial" />
        <span>See how it works</span>
      </a>
      <a className="resource terminology" href="#terminology" onClick={ props.handleOpenTerminologyModal }>
        <img src={ ticon } alt="Terminology" />
        <span>Terminology</span>
      </a>
    </span>
  )
}

export default ResourceButtons;
