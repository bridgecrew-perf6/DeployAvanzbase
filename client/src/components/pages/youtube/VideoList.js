import React from "react";
import VideoItem from "./VideoItem";

const VideoList = ({ videos, videoSelectCallback }) => {
  const renderedList = videos.map((video) => {
    return (
      <VideoItem
        key={video.id.videoId}
        videoObj={video}
        videoSelectCallback={videoSelectCallback}
      />
    );
  });
  return <div>{renderedList}</div>;
};

export default VideoList;
