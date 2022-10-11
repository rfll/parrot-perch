import { useContext, useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { roomContext } from '../providers/RoomProvider';
import Youtube from './apis/Youtube';
import Twitch from './apis/Twitch';
import Chat from './Chat';
import Whiteboard from './whiteboard';


function View() {
  const { room } = useContext(roomContext);
  const [widgetSwitches, setWidgetSwitches] = useState(
    [{ name: 'Twitch', selected: true },
    { name: 'Youtube', selected: true },
    { name: 'Chat', selected: true },
    { name: 'Whiteboard', selected: true }]);

  const selectSwitch = (i) => {
    setWidgetSwitches((oldSwitches) => {
      const selectingSwitch = { ...oldSwitches[i], selected: !oldSwitches[i].selected };
      const newSwitches = [...oldSwitches];
      newSwitches[i] = selectingSwitch;
      return newSwitches;
    });
  }

  const showSwitches = widgetSwitches.map((switcher, i) => {
    const addclass = () => {
      document.querySelector(`[for|=button-${switcher.name}]`).classList.toggle('selected');
  } 

    return <ToggleButton
      className="mb-2"
      id={`button-${switcher.name}`}
      type="checkbox"
      variant="outline-secondary"
      checked={switcher.selected}
      value="1"
      onClick={() => {
        selectSwitch(i)
        addclass()}}
      key={i}
    >
      {switcher.name}
    </ToggleButton>
  });

  return (
    <>
      <div className='header-container'>
        <h3 className='room-header'>Room Name: {room.name}</h3>
      </div>
      <div className='canvas-container'>
      {widgetSwitches[3].selected && <Whiteboard />}
      </div>
        <div id="nav-toggle">
          {showSwitches}
        </div>
      <div className='widget-container'>
        {widgetSwitches[0].selected && <Twitch />}
        {widgetSwitches[1].selected && <Youtube />}
      </div>
        {widgetSwitches[2].selected && <Chat />}
    </>
  );
};

export default View;
