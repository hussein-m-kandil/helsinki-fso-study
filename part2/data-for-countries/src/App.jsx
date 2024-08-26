import { useEffect, useState } from "react";
import axios from "axios";
import Country from "./components/Country";

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log("%cSetting the state of all countries...", "color: orange");
        setAllCountries(response.data);
      })
      .catch((e) => console.log(`%c${e.message}`, "color: red"));
    console.log("%cFetching all countries...", "color: orange");
  }, []);

  useEffect(() => {
    document.getElementById("user-input")?.focus();
  }, [allCountries]);

  const handleSearch = (e) => {
    const v = e.target.value;
    if (v.length > 0) {
      setCountries(
        allCountries.filter((c) =>
          c.name.common.toLowerCase().includes(v.toLocaleLowerCase())
        )
      );
    } else {
      setCountries([]);
    }
  };

  let resultJSX = null;
  if (countries.length > 0) {
    if (countries.length === 1) {
      resultJSX = <Country country={countries[0]} />;
    } else if (countries.length > 10) {
      resultJSX = <div>Too many matches, specify another filter</div>;
    } else {
      resultJSX = countries.map((c) => (
        <div key={`${c.name.official}${c.population}`}>
          {c.name.common}
          <button type="button" onClick={() => setCountries([c])}>
            show
          </button>
        </div>
      ));
    }
  }

  return (
    <>
      <p>
        <label htmlFor="user-input">
          find countries&nbsp;
          <input
            type="text"
            id="user-input"
            onChange={handleSearch}
            disabled={allCountries.length < 1}
            placeholder={allCountries.length < 1 ? "Loading data..." : ""}
            autoFocus={true}
          />
        </label>
      </p>
      {resultJSX}
    </>
  );
};

export default App;
