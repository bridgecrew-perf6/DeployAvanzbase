import React, { useState, useEffect } from "react";
import { GetStockDescription, GetStockNews } from "../../../api/StockAxios";
import NewsRow from "./NewsRow";
import "../../../css/StockOverview.css";

const StockNews = ({ selectedStock }) => {
  const [stockDesc, setStockDesc] = useState("");
  const [news, setNews] = useState([]);

  useEffect(() => {
    // get description of stock
    const getStockDesc = async () => {
      // make request through server
      const response = await GetStockDescription(selectedStock);
      if (typeof response != "undefined") {
        setStockDesc(response.data.Description);
      }
    };
    // get news related to stock
    const getStockNews = async () => {
      // make request through server
      const response = await GetStockNews(selectedStock);
      if (typeof response != "undefined") {
        setNews(response.data);
      }
    };

    getStockDesc();
    getStockNews();
  }, [selectedStock]);

  return (
    <div className="stock-news">
      <div className="news-title">About stock</div>
      <div>{stockDesc}</div>
      <div className="news-title">News</div>
      <div>
        {/* grab the 10 latest news released */}
        {news.slice(0, 10).map((article) => {
          return (
            <NewsRow
              key={article.id}
              headline={article.headline}
              image={article.image}
              datetime={article.datetime}
              url={article.url}
              source={article.source}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StockNews;
