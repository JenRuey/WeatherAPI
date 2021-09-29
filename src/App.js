import _ from "lodash";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import Cookies from "universal-cookie";
import WeatherSearchForm from "./components/form/WeatherSearchForm";
import { FaSearch, FaTrash } from "react-icons/fa";

const TitleBar = styled.div`
  font-weight: bold;
  font-size: 16px;
  padding: 12px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #ededed;
`;

const InformationBar = styled.div`
  border: 2px solid red;
  background: pink;
  padding: 8px;
`;

const SearchHistory = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #ededed;
  display: flex;
  align-items: center;
`;

const CircleShadow = styled.div`
  border-radius: 50%;
  background: #ddd;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

function App() {
  const cookies = new Cookies();

  const [info, setInfo] = React.useState(null);
  const [forceUpdate, setForceUpdate] = React.useState(false);

  const weatherSearch = async (data) => {
    try {
      let apiURL =
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        data.City +
        ",," +
        (data.Country || "") +
        "&appid=" +
        process.env.REACT_APP_OPEN_WEATHER_API_KEY;

      const response = await fetch(apiURL);
      const res = await response.json();

      let newInfo = null;
      if (res.cod === "404") {
        newInfo = { location: "Not Found." };
      } else {
        newInfo = {
          location: res.name + ", " + res.sys.country,
          weather: res.weather[0].main,
          weatherDesc: res.weather[0].description,
          temp:
            (parseFloat(res.main.temp_min) - 273.15).toFixed(2) +
            "°C ~ " +
            (parseFloat(res.main.temp_max) - 273.15).toFixed(2) +
            "°C",
          humidity: res.main.humidity + "%",
          time: moment.unix(res.dt).format("DD MMM YYYY HH:mm:ss"),
        };

        // set cookies
        let _cookies = cookies.get("myweather");
        let array = _cookies || [];
        array.unshift({ ...data, time: moment().format() });
        cookies.set(
          "myweather",
          _.uniqBy(array, (o) => o.City),
          { path: "/" }
        );
      }

      setInfo(newInfo);
    } catch (error) {
      alert(error);
    }
  };

  let _cookies = cookies.get("myweather");
  return (
    <div className={"p-3"} style={{ minWidth: 320 }}>
      <div>
        <TitleBar>Today's Weather</TitleBar>
        <WeatherSearchForm onSubmit={weatherSearch} />
        {info && (
          <div>
            <hr />
            {info.location === "Not Found." ? (
              <InformationBar>{"Not found"}</InformationBar>
            ) : (
              <div style={{ color: "#a6a6a6" }} className={"mx-4"}>
                <small>{info.location}</small>
                <div
                  style={{
                    color: "black",
                    width: 200,
                    fontWeight: "bold",
                    fontSize: 40,
                  }}
                >
                  {info.weather}
                </div>
                <div className={"d-flex"}>
                  <small style={{ width: 110 }}>{"Description:"}</small>
                  <small>{info.weatherDesc}</small>
                </div>
                <div className={"d-flex"}>
                  <small style={{ width: 110 }}>{"Temperature:"}</small>
                  <small>{info.temp}</small>
                </div>
                <div className={"d-flex"}>
                  <small style={{ width: 110 }}>{"Humidity:"}</small>
                  <small>{info.humidity}</small>
                </div>
                <div className={"d-flex"}>
                  <small style={{ width: 110 }}>{"Time:"}</small>
                  <small>{info.time}</small>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <hr />
      <div className={"mt-4"}>
        <TitleBar>Search History</TitleBar>
        {_cookies && _cookies.length > 0 ? (
          _cookies.map((item, index) => {
            return (
              <SearchHistory key={"history-" + index}>
                <div style={{ flex: 1 }}>
                  {index +
                    1 +
                    ". " +
                    item.City +
                    (item.Country ? ", " + item.Country : "")}
                </div>
                <div>{moment(item.time).format("hh:mm:ss A")}</div>
                <div className={"d-flex ml-2"}>
                  <CircleShadow onClick={() => weatherSearch(item)}>
                    <FaSearch />
                  </CircleShadow>
                  <CircleShadow
                    className={"ml-2"}
                    onClick={() => {
                      let _cookies = cookies.get("myweather");
                      let array = _.filter(
                        _cookies || [],
                        (o) => o.City !== item.City
                      );
                      cookies.set(
                        "myweather",
                        _.take(
                          _.uniqBy(array, (o) => o.City),
                          10
                        ),
                        { path: "/" }
                      );
                      setForceUpdate(!forceUpdate);
                    }}
                  >
                    <FaTrash />
                  </CircleShadow>
                </div>
              </SearchHistory>
            );
          })
        ) : (
          <div className={"text-center"}>{"No Record"}</div>
        )}
      </div>
    </div>
  );
}

export default App;
