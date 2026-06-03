import { createContext } from "react";

import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const SocketContext = createContext();

const socket = io('https://video-server-3yjy.onrender.com');

const ContextProvider = ({ children }) => {

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {

        const getStream = async () => {

            try {
                const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                await setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            } catch (error) {
                console.log(error)
            }
        };
        getStream();
        socket.on('me', (id) => { setMe(id) })
        
        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });
    }, []);
    
//     useEffect(() => {
//         console.log("Stream value:", stream);
//       }, [stream]);

    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from });
        });
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
        console.log(userVideo);

        peer.signal(call.signal);
        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit("callUser", { userToCall: id, signalData: data, from: me, name });
        });
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });
        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });
        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        
         window.location.reload();
    }

    return (
        <SocketContext.Provider value={{
            call, callAccepted, myVideo, me, callEnded, stream , setName, name, userVideo, connectionRef, answerCall, callUser, leaveCall
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };

