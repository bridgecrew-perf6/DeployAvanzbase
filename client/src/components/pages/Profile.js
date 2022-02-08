import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../UserContext";
import "../../css/Profile.css";
import Button from "@material-ui/core/Button";
import {
  ChangeProfile,
  GetCurrentUser,
  DeleteAccount,
} from "../../api/ProfileApi";
import { useHistory } from "react-router-dom";
import { Logout } from "../../api/AuthenticateUser";

const Profile = () => {
  const { contextUser, setContextUser } = useContext(UserContext);
  const [editOn, setEditOn] = useState(false);
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");
  let history = useHistory();

  const changeProfile = async () => {
    if (newPasswordRef.current.value === confirmPasswordRef.current.value) {
      await ChangeProfile(
        firstNameRef.current.value,
        lastNameRef.current.value,
        confirmPasswordRef.current.value,
        contextUser.email
      );

      const responseData = await GetCurrentUser(contextUser.email);
      if (responseData != null) {
        setContextUser(responseData.data);
      }
    } else {
      alert(
        "There appears to be difference between the new password and confirmed password."
      );
    }
  };

  const deleteAccount = async () => {
    await DeleteAccount(contextUser.email);
    //go back to login page
    await Logout();
    setContextUser(null);
    history.push("/sign-in");
  };

  if (!contextUser) return <></>;

  return (
    <div className="profile">
      <div className="profile-container">
        <h1>
          {contextUser.first_name.charAt(0).toUpperCase() +
            contextUser.first_name.slice(1)}{" "}
          {contextUser.last_name.charAt(0).toUpperCase() +
            contextUser.last_name.slice(1)}
        </h1>
        <div className="profile-data">
          <h4>Email: </h4> <p>{contextUser.email}</p>
          <h4>First name: </h4>{" "}
          {editOn ? (
            <input
              className="profile-data-box"
              defaultValue={
                contextUser.first_name.charAt(0).toUpperCase() +
                contextUser.first_name.slice(1)
              }
              ref={firstNameRef}
            />
          ) : (
            <p style={{ height: "30px" }}>
              {contextUser.first_name.charAt(0).toUpperCase() +
                contextUser.first_name.slice(1)}
            </p>
          )}
          <h4>Last name: </h4>{" "}
          {editOn ? (
            <input
              className="profile-data-box"
              defaultValue={
                contextUser.last_name.charAt(0).toUpperCase() +
                contextUser.last_name.slice(1)
              }
              ref={lastNameRef}
            />
          ) : (
            <p style={{ height: "30px" }}>
              {contextUser.last_name.charAt(0).toUpperCase() +
                contextUser.last_name.slice(1)}
            </p>
          )}
          <h4>New password: </h4>
          {editOn ? (
            <input
              type="password"
              className="profile-data-box"
              ref={newPasswordRef}
            />
          ) : (
            <div className="profile-data-box"></div>
          )}
          <h4>Confirm password: </h4>
          {editOn ? (
            <input
              type="password"
              className="profile-data-box"
              ref={confirmPasswordRef}
            />
          ) : (
            <div className="profile-data-box"></div>
          )}
          <div className="profile-btn">
            {editOn ? (
              <Button
                style={{
                  color: "white",
                  border: "white 1px solid",
                  backgroundColor: "#9381ff",
                  marginRight: "20px",
                }}
                onClick={() => changeProfile()}
              >
                Confirm changes
              </Button>
            ) : (
              <></>
            )}
            <Button
              variant="outlined"
              style={{
                color: "#9381ff",
                border: "#9381ff 1px solid",
                marginRight: "20px",
              }}
              onClick={() => setEditOn(!editOn)}
            >
              {editOn ? "Unedit profile" : "Edit profile"}
            </Button>
            <Button
              variant="outlined"
              style={{
                color: "red",
                border: "red 1px solid",
              }}
              onClick={() => deleteAccount()}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
