import React from 'react';

const Video = () => {
  return (
    <div className="box">
      <div className="box-header with-border">
        <h3 className="box-title">
          <a data-toggle="collapse" data-parent="#accordion" href="#collapseVideo" aria-expanded="false" className="collapsed">
            See how it works
          </a>
        </h3>
      </div>
      <div className="box-body panel-collapse collapse" id="collapseVideo" aria-expanded="false" style={{ height: "0px" }}>
        <div className="video-container">
          <iframe src="https://www.youtube.com/embed/5hZJ0Ot7Iuo" frameBorder="0" title="Sai Simple Stable Coin Dashboard" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  )
}

export default Video;
