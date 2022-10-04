import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Results from "./Results";

export default function LiveSearch(props) {
  const [results, setResults] = useState([]);
  let token = '';

  useEffect(() => {
    if (props.newChannel === '') {
      setResults([])
    }
    const testURL = `https://api.twitch.tv/helix/search/channels?query=${props.newChannel}`;
    axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_GRANT_TYPE
    })
      .then(response => {
        token = response.data.access_token

        axios.get('https://id.twitch.tv/oauth2/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      })
      .then(response => {
        axios.get(testURL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.REACT_APP_CLIENT_ID
          }
        })
          .then(response => {
            setResults([...response.data.data])
            console.log(results);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [props.newChannel]);

  return (
    <Fragment>
      <main>
        <SearchBar
          setNewChannel={props.setNewChannel}
        />
        <Results
          results={results}
          handleChannel={props.handleChannel}
        />
      </main>
    </Fragment>
  );
}