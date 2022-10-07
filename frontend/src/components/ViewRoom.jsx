import { useContext, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { roomContext } from '../providers/RoomProvider';
import Youtube from './apis/Youtube';
import Twitch from './apis/Twitch';
import Chat from './Chat';
import Whiteboard from './Whiteboard';


function View() {
  const { room } = useContext(roomContext);
  const [widgetSwitches, setWidgetSwitches] = useState(
    [{ name: 'twitch', selected: false },
    { name: 'youtube', selected: false },
    { name: 'chat', selected: false },
    { name: 'whiteboard', selected: true }]);

  const selectSwitch = (i) => {
    setWidgetSwitches((oldSwitches) => {
      const selectingSwitch = { ...oldSwitches[i], selected: !oldSwitches[i].selected };
      const newSwitches = [...oldSwitches];
      newSwitches[i] = selectingSwitch;
      return newSwitches;
    });
  }

  const showSwitches = widgetSwitches.map((switcher, i) => {
    return <ToggleButton
      className="mb-2"
      id="toggle-check"
      type="checkbox"
      variant="outline-primary"
      checked={switcher.selected}
      value="1"
      onClick={() => selectSwitch(i)}
      key={i}
    >
      {switcher.name}
    </ToggleButton>
  });

  return (
    <div>
      Room Name: {room.name}
      {widgetSwitches[3].selected && <Whiteboard />}
      {showSwitches}
      {widgetSwitches[0].selected && <Twitch />}
      {widgetSwitches[1].selected && <Youtube />}
      {widgetSwitches[2].selected && <Chat />}
    </div>
  );
};

export default View;
