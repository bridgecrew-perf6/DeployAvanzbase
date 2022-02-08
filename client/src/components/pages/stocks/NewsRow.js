import React from "react";
import "../../../css/NewsRow.css";

const NewsRow = ({ headline, image, datetime, url, source }) => {
  const routeChange = () => {
    window.location.href = url;
  };

  // convert unix time stamp to date
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    return date + " " + month + " " + year;
  }

  return (
    <div className="news-row" onClick={routeChange}>
      <img className="news-img" src={image} alt="" />
      <div className="news-text-field">
        <h3>{headline}</h3>
        <p>
          {source} - {timeConverter(datetime)}
        </p>
      </div>
    </div>
  );
};

export default NewsRow;
