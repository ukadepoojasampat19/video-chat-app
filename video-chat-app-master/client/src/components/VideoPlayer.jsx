import { useContext } from "react";

import { SocketContext } from "../SocketContext";

const VideoPlayer = () => {

  const context = useContext(SocketContext);

  return (
    <div className="flex flex-col space-y-4 lg:flex-row sm:flex-row sm:space-y-0 sm:space-x-11 ">
      {context.myVideo &&
          <div className="videoPlayer ">
            {context.callAccepted && <h5>You</h5>}
            <video className="border-4 " playsInline muted ref={context.myVideo} autoPlay />
          </div>
      }
      {context.callAccepted && !context.callEnded &&
        <div className="videoPlayer">
            <h5>{context.call.name || "Name"} </h5>
            <video className="border-4" playsInline ref={context.userVideo} autoPlay />
          </div>
      }
    </div>
  )
}

export default VideoPlayer
