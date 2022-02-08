import React from "react";
import "../../../css/VideoItem.css";

const VideoItem = ({ videoObj, videoSelectCallback }) => {
  return (
    <div
      onClick={() => videoSelectCallback(videoObj)}
      className="video-item item"
    >
      <img
        className="ui image"
        alt={videoObj.snippet.title}
        src={videoObj.snippet.thumbnails.medium.url}
      />
      <div className="content">
        <div className="video-item-title">{videoObj.snippet.title}</div>
      </div>
    </div>
  );
};

export default VideoItem;
