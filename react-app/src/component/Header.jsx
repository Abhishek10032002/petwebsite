import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function Header(props) {
  const [loc, setLoc] = useState(null);
  const [showOver, setshowOver] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  let locations = [
    {
      latitude: 28.6139,
      longitude: 77.209,
      placename: "New Delhi, Delhi",
    },
    {
      latitude: 19.076,
      longitude: 72.8777,
      placename: "Mumbai, maharashtra",
    },
    {
      latitude: 28.841064,
      longitude: 78.795319,
      placename: "Moradabad, Uttarpradesh",
    },
  ];

  return (
    <div className="header-container d-flex justify-content-between">
      <div className="header">
        <img src="" alt="" />
        <Link className="links " to="/">
          HOME
        </Link>
        <select
          value={loc}
          onChange={(e) => {
            localStorage.setItem("userLoc", e.target.value);
            setLoc(e.target.value);
          }}
        >
          {locations.map((item, index) => {
            return (
              <option value={`${item.latitude},${item.longitude}`}>
                {item.placename}
              </option>
            );
          })}
        </select>
        <input
          className="search"
          type="text"
          value={props && props.search}
          onChange={(e) => {
            props.handlesearch && props.handlesearch(e.target.value);
          }}
        />
        <button
          className="search-btn"
          onClick={() => props.handleClick && props.handleClick()}
        >
          <FaSearch />
        </button>
      </div>

      <div>
        <div
          onClick={() => {
            setshowOver(!showOver);
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#002f34",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          N
        </div>
        {showOver && (
          <div
            style={{
              minHeight: "100px",
              width: "200px",
              position: "absolute",
              top: "0",
              right: "0",
              zIndex: 1,
              marginTop: "50px",
              marginRight: "50px",
              color: "red",
              fontSize: "14px",
              background: "#002f34",
              borderRadius: "7px",
            }}
          >
            <div>
              {!!localStorage.getItem("token") && (
                <Link to="/add-product">
                  <button className="logout-btn">ADD PETS</button>
                </Link>
              )}
            </div>
            <div>
              {!!localStorage.getItem("token") && (
                <Link to="/liked-products   ">
                  <button className="logout-btn">FAVROITE PETS</button>
                </Link>
              )}
            </div>
            <div>
              {!!localStorage.getItem("token") && (
                <Link to="/my-products   ">
                  <button className="logout-btn">MY PETS</button>
                </Link>
              )}
            </div>
            <div>
              {!localStorage.getItem("token") ? (
                <Link to="/login">LOGIN</Link>
              ) : (
                <button className="logout-btn" onClick={handleLogout}>
                  LOGOUT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
