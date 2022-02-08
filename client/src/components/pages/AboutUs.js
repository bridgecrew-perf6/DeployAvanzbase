import React from "react";
import "../../css/AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="about-us">
        <h1>About us</h1>
        <div
          style={{
            display: "flex",
          }}
        >
          <div className="about-us-container">
            <p>
              Avanzbase is a tool for keeping track of the stocks and crypto
              coins that may interest you. The tool makes use of APIs to get
              up-to-date data on stocks and coins, so that the user then can
              save the these in their portfolios
            </p>
            <h3 className="how-it-works"> Here is how it works</h3>
            <p>1. Create an account using you email</p>
            <p>2. Create a portoflio and add comment about what it is about</p>
            <p>
              3. Add any of the following items to the portfolio to organize
              your thoughts:
            </p>
            <ul className="list-items">
              <li>Stock</li>
              <li>Coin</li>
              <li>Video</li>
            </ul>

            <h5>More functionalities coming soon...</h5>
          </div>
          <img
            style={{
              width: "650px",
              marginRight: "-750px",
              marginLeft: "100px",
            }}
            className="desk-office"
            src="assets/desk-office.png"
            alt="icon"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
