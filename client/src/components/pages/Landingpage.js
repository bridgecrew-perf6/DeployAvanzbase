import React from "react";
import "../../css/LandingPage.css";
import ImageCard from "../utils/ImageCard";

const Landingpage = () => {
  return (
    <div className="landing-page-container">
      <div className="landing-row">
        <div className="landing-text">
          <h1> Portfolio Research In One Place</h1>
          <h3>
            Keep track of you thoughts on the market, stocks, coins and more!
          </h3>
        </div>
        <img
          className="one-place-logo"
          src="assets/landingpage-icon.png"
          alt="icon"
        />
      </div>
      <div className="card-section">
        <ImageCard
          title={"How it works"}
          card_image={"assets/how-it-works.png"}
          desc={
            "Step-by-step guide how to create save all important information and get structure you thoughts and ideas on the market."
          }
        />
        <ImageCard
          title={"Research portfolio"}
          card_image={"assets/portfolio.png"}
          desc={
            "Manage and handle all you portfolios in a easy and simple manner."
          }
        />
        <ImageCard
          title={"Explore markets"}
          card_image={"assets/explore-market.png"}
          desc={
            "Here you can explore any market that you are interested in - stock or crypto. Your choice!"
          }
        />
      </div>
    </div>
  );
};

export default Landingpage;
