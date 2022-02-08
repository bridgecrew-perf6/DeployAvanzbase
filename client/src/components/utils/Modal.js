import React, { useRef, useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import "../../css/Modal.css";
import { GetPortfolios } from "../../api/PortfolioApi";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#b8b8ff",
  padding: "50px",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  borderRadius: "30px",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  zIndex: 1000,
};

const Modal = ({
  children,
  open,
  onClose,
  createNewPortfolio,
  modalType,
  onAdd,
}) => {
  const nameRef = useRef("");
  const commentRef = useRef("");
  const { contextUser } = useContext(UserContext);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    if (modalType === "addObject") {
      async function fetchPortfolios() {
        try {
          // check if context user exist
          if (contextUser) {
            const response = await GetPortfolios(contextUser.email);
            if (response.data.length > 0) {
              setPortfolios(response.data);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      fetchPortfolios();
    }
  }, [contextUser, modalType]);

  if (!open) return null;
  return (
    <div className="modal-container">
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          {modalType === "addObject" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="portfolio-add-list">
                {portfolios.map((portfolioObject) => {
                  return (
                    <div key={portfolioObject.id} className="portfolio-add-row">
                      <h3>{portfolioObject.portfolio_name} </h3>
                      <button
                        type="submit"
                        className="add-object-button"
                        onClick={() =>
                          onAdd(
                            portfolioObject.portfolio_name,
                            contextUser.email
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
              <button className="modal-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          ) : (
            <form className="portfolio-form">
              <input
                className="modal-input"
                label="Portfolio name"
                placeholder="Portfolio name"
                ref={nameRef}
              />
              <textarea
                className="portfolio-textarea"
                placeholder="What is this portfolio about?"
                ref={commentRef}
              ></textarea>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="submit"
                  className="modal-button"
                  onClick={() =>
                    createNewPortfolio(
                      nameRef.current.value,
                      commentRef.current.value
                    )
                  }
                >
                  Submit
                </button>
                <button className="modal-button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
