import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../../css/PortfolioObject.css";
import {
  GetPortfolioItems,
  DeletePortfolio,
  DeleteObject,
  SaveComment,
} from "../../api/PortfolioApi";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@mui/material/Typography";

function PortfolioObject({ data, email, fetchPortfolios }) {
  const [coins, setCoins] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editOn, setEditOn] = useState(false);
  const [comment, setComment] = useState(data.comment);
  const commentRef = useRef(data.comment);

  useEffect(() => {
    //get all coins for specific portfolio

    fetchCoins();
    fetchStocks();
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, email]);

  const fetchCoins = async () => {
    const responseCoins = await GetPortfolioItems(
      "coins",
      data.portfolio_name,
      email
    );
    if (responseCoins.data.length > 0) {
      setCoins(responseCoins.data);
    } else {
      setCoins([]);
    }
  };

  const fetchStocks = async () => {
    const responseStocks = await GetPortfolioItems(
      "stocks",
      data.portfolio_name,
      email
    );
    if (responseStocks.data.length > 0) {
      setStocks(responseStocks.data);
    } else {
      setStocks([]);
    }
  };

  const fetchVideos = async () => {
    const responseVideos = await GetPortfolioItems(
      "videos",
      data.portfolio_name,
      email
    );
    if (responseVideos.data.length > 0) {
      setVideos(responseVideos.data);
    } else {
      setVideos([]);
    }
  };

  const toggleEditPortfolio = () => {
    setEditOn(!editOn);
  };

  const deletePortfolio = async () => {
    await DeletePortfolio(data.portfolio_name, email);
    fetchPortfolios();
  };

  const removeObject = async (type, objectName) => {
    await DeleteObject(type, objectName, data.portfolio_name, email);
    switch (type) {
      case "stock":
        fetchStocks();
        break;
      case "coin":
        fetchCoins();
        break;
      case "video":
        fetchVideos();
        break;
      default:
        console.log("Empty");
    }
  };

  const saveComment = async (newComment) => {
    await SaveComment(data.portfolio_name, email, newComment);
    setComment(newComment);
  };

  return (
    <Accordion style={{ backgroundColor: "#9381ff", color: "white" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ fill: "white" }} />}
      >
        <Typography component={"span"}>
          {" "}
          <h2 className="portfolio-name">{data.portfolio_name} </h2>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography component={"div"}>
          <div className="portfolio-object-container">
            <div className="portfolio-stocks">
              <span style={{ fontWeight: "bold" }}>
                Stocks ({stocks.length})
              </span>
              {stocks.map((stock) => {
                const url = stock.url.replace(
                  "https://avanzbase.herokuapp.com/",
                  ""
                );
                return (
                  <div key={stock.id}>
                    <Link to={url} className="portfolio-link-object">
                      {stock.symbol}
                    </Link>
                    {editOn ? (
                      <button
                        className="boxclose"
                        onClick={() => removeObject("stock", stock.symbol)}
                      />
                    ) : (
                      <></>
                    )}{" "}
                  </div>
                );
              })}
            </div>
            <div className="portfolio-videos">
              <span style={{ fontWeight: "bold" }}>
                Videos ({videos.length})
              </span>
              {videos.map((video) => {
                const url = `http://www.youtube.com/watch?v=${video.url}`;
                return (
                  <div style={{ display: "flex" }} key={video.id}>
                    <a
                      className="portfolio-link-object"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {video.symbol}
                    </a>
                    {editOn ? (
                      <button
                        className="boxclose"
                        onClick={() => removeObject("video", video.symbol)}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="portfolio-coins">
              <span style={{ fontWeight: "bold" }}>Coins ({coins.length})</span>
              {coins.map((coin) => {
                return (
                  <div style={{ display: "flex" }} key={coin.id}>
                    <div className="portfolio-link-object">{coin.symbol}</div>
                    {editOn ? (
                      <button
                        className="boxclose"
                        onClick={() => removeObject("coin", coin.symbol)}
                      />
                    ) : (
                      <></>
                    )}{" "}
                  </div>
                );
              })}
            </div>

            <div className="portfolio-comment">
              <span style={{ fontWeight: "bold" }}>
                Comment{" "}
                {editOn ? (
                  <button
                    className="add-comment-btn"
                    onClick={() => saveComment(commentRef.current.value)}
                  >
                    Save comment
                  </button>
                ) : (
                  <></>
                )}
              </span>
              {editOn ? (
                <textarea
                  className="portfolio-textarea"
                  style={{ marginTop: "2px" }}
                  ref={commentRef}
                  defaultValue={comment}
                />
              ) : (
                <>{comment}</>
              )}
            </div>
          </div>
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button
              variant="outlined"
              style={{
                color: "white",
                border: "white 1px solid",
                marginRight: "20px",
              }}
              onClick={() => toggleEditPortfolio()}
            >
              {editOn ? "Unedit" : "Edit"}
            </Button>
            <Button
              variant="outlined"
              style={{
                color: "red",
                border: "red 1px solid",
              }}
              onClick={() => deletePortfolio()}
            >
              Delete portfolio
            </Button>
          </div>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default PortfolioObject;
