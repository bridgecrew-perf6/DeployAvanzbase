import React, { useState, useEffect } from "react";
import SearchBarnew from "../../utils/SearchBar";
import { GetVideos } from "../../../api/YoutubeAxios";
import VideoList from "./VideoList";
import VideoDetail from "./VideoDetail";
import "../../../css/Youtube.css";

const Youtube = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [term, setTerm] = useState("");

  useEffect(() => {
    onTermSubmit("stock analysis");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTermSubmit = async (term) => {
    const response = await GetVideos(term);
    if (typeof response != "undefined") {
      setVideos(response.data.items);
      setSelectedVideo(response.data.items[0]);
    }
  };

  const onTermChange = (newTerm) => {
    setTerm(newTerm);
  };

  return (
    <div className="youtube">
      <div className="youtube-container">
        <div className="youtube-search-bar">
          <SearchBarnew
            hint={"Search stock..."}
            searchTerm={term}
            onSearchTermChange={onTermChange}
            classStyle={"search-bar-videos"}
            searchFunction={() => onTermSubmit(term)}
          />
        </div>
        <div className="videos-container">
          <VideoDetail className="video-detail" video={selectedVideo} />
          <VideoList
            className="video-list"
            videos={videos}
            videoSelectCallback={setSelectedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default Youtube;
