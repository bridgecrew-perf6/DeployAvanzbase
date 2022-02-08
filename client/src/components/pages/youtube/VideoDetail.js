import React, { useState, useContext } from "react";
import "../../../css/VideoDetail.css";
import AddButton from "../../utils/AddButton";
import Modal from "../../utils/Modal";
import { AddObjectToPortfolio } from "../../../api/PortfolioApi";
import { UserContext } from "../../UserContext";

const VideoDetail = ({ video }) => {
  const { contextUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  /* add coin to portfolio */
  const addVideo = async (portfolio_name, email) => {
    setIsOpen(!isOpen);
    // send post request to server adding video to selected portfolio
    await AddObjectToPortfolio(
      "video",
      video.id.videoId,
      video.snippet.title,
      portfolio_name,
      email
    );
  };

  if (!video) {
    return <div>Loading...</div>;
  }
  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;
  return (
    <div className="video-detail">
      <div className="video-detail-container">
        <iframe className="video-player" title="video player" src={videoSrc} />
      </div>
      <div
        className="details-header-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <h4>{video.snippet.title}</h4>
        {contextUser ? (
          <AddButton
            text={"Add Video"}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        ) : (
          <></>
        )}
      </div>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        onAdd={addVideo}
        modalType={"addObject"}
      ></Modal>
    </div>
  );
};

export default VideoDetail;
