import React, { useState, useContext } from "react";
import "../../../css/Newsfeed.css";
import LineGraph from "./LineGraph";
import TimeLine from "./TimeLine";
import StockOverview from "./StockOverview";
import AddButton from "../../utils/AddButton";
import { UserContext } from "../../UserContext";
import Modal from "../../utils/Modal";
import { AddObjectToPortfolio } from "../../../api/PortfolioApi";

function Newsfeed({ selectedStock }) {
  const [timeSpan, setTimeSpan] = useState("1D");
  const { contextUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const changeTimeSpan = (newTimeSpan) => {
    setTimeSpan(newTimeSpan);
  };

  /* add stock to portfolio */
  const addStock = async (portfolio_name, email) => {
    setIsOpen(!isOpen);
    // send post request to server adding stock to selected portfolio
    await AddObjectToPortfolio(
      "stock",
      window.location.href,
      selectedStock,
      portfolio_name,
      email
    );
  };

  return (
    <div className="newsfeed">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>{selectedStock}</h1>
        {contextUser ? (
          <AddButton
            text={"Add Stock"}
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
        onAdd={addStock}
        modalType={"addObject"}
      ></Modal>
      <div className="newsfeed-container">
        <div className="newsfeed-chartSection">
          <div className="newsfeed-chart">
            <LineGraph selectedStock={selectedStock} timeSpan={timeSpan} />
            <TimeLine changeTimeSpan={changeTimeSpan} timeSpan={timeSpan} />
            <StockOverview selectedStock={selectedStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsfeed;
