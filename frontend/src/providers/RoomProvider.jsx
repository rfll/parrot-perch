import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import useDebounce from "../hooks/useDebounce";

export const roomContext = createContext();

export default function RoomProvider(props) {
  // room and socket state for a client
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState({
    name: '',
    channel: '',
    users: []
  });
  const [isViewing, setIsViewing] = useState(false);
  // Chat only state
  const [to, setTo] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  // Channel changing state
  const [newChannel, setNewChannel] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  // Chat and Rooms useEffect
  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('connected');
      
    });

    socket.on('serveRoom', (res) => {
      const room = res.room;
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      const message = res.message;
      if (message) {
        setMessages(prev => [message, ...prev]);
      }
      setIsViewing(true);
    });

    socket.on('system', data => {
      // console.log(data);
      const { message, room } = data
      setRoom((oldRoom) => {
        return { ...oldRoom, name: room.name, channel: room.channel, users: room.users };
      });
      setMessages(prev => [message, ...prev]);
    });

    socket.on('public', data => {
      const message = `${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Keeps all messages in history right now
    });

    socket.on('private', data => {
      const message = `PM from ${data.username}: ${data.msg}`;
      setMessages(prev => [message, ...prev]); // Same as public. 
    });

    return () => socket.disconnect();
  }, []);

  // API use
  useEffect(() => {
    let token = '';
    if (newChannel === '') {
      setSearchResults([])
      return;
    }
    const searchURL = `https://api.twitch.tv/helix/search/channels?query=${newChannel}`;
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
        axios.get(searchURL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.REACT_APP_CLIENT_ID
          }
        })
          .then(response => {
            setSearchResults([...response.data.data])
            // console.log(results);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [newChannel]);

  const term = useDebounce(newChannel, 200);

  const onSearch = useCallback(setNewChannel, [term]);

  // on search use effect
  useEffect(() => {
    onSearch(term);
    setNewChannel(term);
  }, [term, onSearch]);


  // Export any usable state or state setters (or custom functions to set state) by declaring them here.
  const roomData = { 
    to, setTo, 
    messages, setMessages, 
    msg, setMsg, 
    socket, setSocket, 
    isViewing, setIsViewing, 
    room, setRoom,
    newChannel, setNewChannel,
    searchResults, setSearchResults,
    searchValue, setSearchValue
   };

  return (
    <roomContext.Provider value={roomData}>
      {props.children}
    </roomContext.Provider>
  );
};