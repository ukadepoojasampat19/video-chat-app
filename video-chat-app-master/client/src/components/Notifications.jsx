import { useContext } from 'react';
import { SocketContext } from '../SocketContext';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        (<div className='flex justify-center items-center mt-4 animate-bounce '>
          <h1>{call.name} is calling</h1>
          <button onClick={answerCall} className='text-green-500 px-2 ml-3 bg-white hover:bg-[#e1e7ff] border-2 rounded-md '>
            Answer
          </button>
        </div>
        )
      )}
    </>
  );
};

export default Notifications;