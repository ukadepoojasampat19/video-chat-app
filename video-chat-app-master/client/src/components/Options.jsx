import React, { useContext, useState } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { SocketContext } from "../SocketContext";

const submitHandler = (e) => {
  e.preventDefault()
}
const Options = ({ children }) => {
  const context = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <div className='holder'>
      <form noValidate onSubmit={submitHandler} autoComplete='off'>
        <div className='flex flex-row space-x-2 sm:space-x-96 mt-4 ml-2' >
          <div className='text-center  w-1/2 space-y-1 sm:space-x-2'>
            <h6 className='sm:translate-x-4'>Your Name</h6>
            <input placeholder='Name' type="text" name='Name' value={context.name} onChange={(e) => { context.setName(e.target.value) }} className='bg-white opacity-50 rounded-md text-center w-5/6 placeholder-slate-700 placeholder:translate-x-2' />
            <CopyToClipboard text={context.me}>
              <button className='bg-[#6367eb] px-2 border-2 rounded-md text-[#e1e7ff] hover:bg-[#4345a5]'>
                Copy Your ID
              </button>
            </CopyToClipboard>
          </div>
          <div className='text-center content-center  w-1/2 space-y-1 sm:space-x-2' >
            <h6 className='sm:translate-x-4'>Make a call</h6>
            <input placeholder='ID to Call' type="text" name='ID to call' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} className='bg-white opacity-50 rounded-md text-center w-5/6 placeholder-slate-700 placeholder:translate-x-2' />
            {context.callAccepted && !context.callEnded ? (
              <button onClick={context.leaveCall} className='text-red-600 px-2 bg-white hover:bg-[#e1e7ff]  border-2 rounded-md'>
                Hang Up
              </button>
            ) : (
              <button onClick={() => context.callUser(idToCall)} className='text-green-500 px-2  bg-white hover:bg-[#e1e7ff] border-2 rounded-md'>
                Call
              </button>
            )}
          </div>
        </div>
      </form>
      {children}
    </div>

  )
}

export default Options
