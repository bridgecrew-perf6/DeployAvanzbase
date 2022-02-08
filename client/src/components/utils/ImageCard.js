import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useHistory } from "react-router-dom";

const ActionAreaCard = ({ title, card_image, desc }) => {
  const history = useHistory();
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    const markets = [
      "stocks/aapl",
      "stocks/tsla",
      "stocks/msft",
      "stocks/baba",
    ];
    switch (title) {
      case "Research portfolio":
        setPageUrl("/portfolio");
        break;
      case "Explore markets":
        const randomNum = Math.floor(Math.random() * markets.length);
        setPageUrl(markets[randomNum]);
        break;
      default:
        setPageUrl("/about-us");
        break;
    }
  }, [title]);

  return (
    <Card sx={{ maxWidth: 500 }} onClick={() => history.push(pageUrl)}>
      {/* force flexDirection column*/}
      <CardActionArea style={{ display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="300"
          image={process.env.PUBLIC_URL + card_image}
          alt="card-img"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ActionAreaCard;
