import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import AddButton from "../utils/AddButton";
import "../../css/Portfolio.css";
import Modal from "../utils/Modal";
import PortfolioObject from "./PortfolioObject";
import { CreateNewPortfolio, GetPortfolios } from "../../api/PortfolioApi";

function Portfolio() {
  const { contextUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetchPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextUser]);

  async function fetchPortfolios() {
    try {
      if (contextUser) {
        const response = await GetPortfolios(contextUser.email);
        if (response.data.length > 0 && response.data !== "Unauthorized") {
          setPortfolios(response.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  // handle toogle creating new portfolio pop up
  const toggleNewPortfolio = () => {
    setIsOpen(!isOpen);
  };

  /* takes input to Modal (name and comment) and makes request to server to create 
   new portfolio in database */
  const createNewPortfolio = async (name, comment) => {
    await CreateNewPortfolio(name, comment, contextUser.email);
  };

  return (
    <div className="portfolio-main">
      <div className="create-portfolio-button">
        <AddButton text={"Create new portfolio"} onClick={toggleNewPortfolio} />
      </div>
      <div className="portfolio-column">
        {portfolios !== undefined &&
        portfolios.length > 0 &&
        contextUser !== null ? (
          portfolios.map((portfolioObject) => {
            return (
              <PortfolioObject
                key={portfolioObject.id}
                data={portfolioObject}
                email={contextUser.email}
                fetchPortfolios={fetchPortfolios}
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
      <Modal
        open={isOpen}
        onClose={toggleNewPortfolio}
        createNewPortfolio={createNewPortfolio}
      >
        Create new portfolio
      </Modal>
    </div>
  );
}

export default Portfolio;
