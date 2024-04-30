import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const URL = "http://localhost:3000/api";

export default function App() {
  const [plainTxt, setPlainTxt] = useState<string>("");
  const [encryptedTxt, setEncryptedTxt] = useState<string>("");

  const handlePlainTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPlainTxt(e.target.value);
  }

  const handleEncryptedTxtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setEncryptedTxt(e.target.value);
  }

  const doEncryption = async (text: string) => {
    try {
      const response = await axios(`${URL}/encrypt?plainText=${text}`);
      // console.log('response.data', response.data.result);
      if (response.data?.msg === "encrypted successfully") {
        setEncryptedTxt(response.data.result);
      } else {
        toast.error("Something went try again. Please try again", { toastId: "tryBlockErr" })
      }
    } catch (e) {
      toast.error('Server error: something went try again. Please try again', { toastId: "catchBlockErr" });
    }

  }

  const generatePassword = () => {
    // console.log('plainTxt', plainTxt);
    if (plainTxt?.length == 0 || plainTxt?.length < 3) {
      toast.warning("please enter atleast 3 characters in plain text field", { toastId: 'characters' });
    }
    else {
      doEncryption(plainTxt);
      // setEncryptedTxt(encryptedTxt + plainTxt);
    }
  }

  const decryptPassword = () => {
    console.log('encryptedTxt', encryptedTxt);
    // if (plainTxt?.length < 0) {
    //   alert("please enter atleast a single character in plain text field");
    // }
    // else {
    //   setEncryptedTxt(plainTxt);
    // }
  }
  const clear = () => {
    setPlainTxt("");
    setEncryptedTxt("");
  }
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center min-w-96">
      <div className="relative border rounded-md border-slate-900 bg-black shadow-sm shadow-white w-full mx-3 md:w-96">
        <div className="p-6">
          <h3 className="text-3xl text-white text-center">Password Generator</h3>
          <div className="mt-5">
            <input type="text" value={plainTxt} className="p-2 mb-4 w-full border rounded-sm" placeholder="Enter plain text here"
              onChange={handlePlainTxtChange} />
            <textarea rows={6} value={encryptedTxt} className="p-2 w-full border rounded-sm resize-none"
              placeholder="Encrypted Password will come here" onChange={handleEncryptedTxtChange} />
            <div className="flex justify-end">
              <button className="text-white bg-blue-600 hover:bg-opacity-50 mt-2 text-md px-4 py-2 border-none rounded-md">copy</button>
            </div>
          </div>
          <div className="mt-4">
            <button className="text-white bg-green-600 hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={generatePassword}>Generate (Encrypt)</button>
            <button className="text-white bg-red-600 hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={decryptPassword}>Decrypt (Generate original text)</button>
            <button className="text-white bg-slate-600 hover:bg-opacity-50 mt-2 text-md w-full px-4 py-2 border-none rounded-md" onClick={clear}> Clear Text</button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      // className="custom-toast"
      />
    </div>
  );
}
