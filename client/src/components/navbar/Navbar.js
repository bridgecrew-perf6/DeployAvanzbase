import React, { useContext, useState, useEffect } from "react";
import { ButtonNavbar } from "./ButtonNavbar";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../UserContext";
import { Logout } from "../../api/AuthenticateUser";

function Navbar() {
  const { contextUser, setContextUser } = useContext(UserContext);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [click, setClick] = useState(false);

  const logout = async () => {
    await Logout();
    setContextUser(null);
  };

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  const closeMenuAndLogout = () => {
    closeMobileMenu();
    logout();
  };
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <i className="fas fa-suitcase fa-rotate-270" />
          Avanzbase
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/youtube-api"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Videos
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/crypto-table"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Coins
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/stocks/aapl"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Stocks
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about-us"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>
          </li>

          {contextUser == null && click && width < 1115 ? (
            <div>
              <li className="nav-item">
                <Link
                  to="/sign-in"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/sign-up"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
            </div>
          ) : (
            <></>
          )}
          {contextUser != null && click && width < 1115 ? (
            <div>
              <li className="nav-item">
                <Link
                  to="/portfolio"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/profile"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-links"
                  onClick={() => {
                    closeMenuAndLogout();
                  }}
                >
                  Logout
                </Link>
              </li>
            </div>
          ) : (
            <></>
          )}
        </ul>
        {contextUser == null && width > 1115 ? (
          <>
            <ButtonNavbar
              buttonClass={"sign-in"}
              text={"Sign In"}
              path={"/sign-in"}
              className="nav-links"
              onClick={closeMobileMenu}
            />
            <ButtonNavbar
              buttonClass={"sign-up"}
              text={"Sign Up"}
              path={"/sign-up"}
              onClick={closeMobileMenu}
            />
          </>
        ) : (
          <></>
        )}

        {contextUser != null && width > 1115 ? (
          <ul style={{ display: "flex" }}>
            <li className="nav-item">
              <Link
                to="/portfolio"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Portfolio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <div className="profile-name">
                  <p>
                    {contextUser.first_name.charAt(0).toUpperCase() +
                      contextUser.first_name.slice(1)}
                  </p>
                  <p>
                    {contextUser.last_name.charAt(0).toUpperCase() +
                      contextUser.last_name.slice(1)}
                  </p>
                </div>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={() => logout()}>
                Logout
              </Link>
            </li>
          </ul>
        ) : (
          <></>
        )}
      </nav>
    </>
  );
}

export default Navbar;
