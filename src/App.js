import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const [allWaves, setAllWaves] = useState([]);

  const contractAddress ='0x00eDE1A78aaeAB2FB26eff271deADb50e8aFf77c';
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContractAddress = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await waveContractAddress.getAllmessages();
   
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.sender,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

      setAllWaves(wavesCleaned);
      }
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
  let waveContractAddress;

  const onNewWave = (from, timestamp, message) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    waveContractAddress = new ethers.Contract(contractAddress, contractABI, signer);
    waveContractAddress.on('NewWave', onNewWave);
  }

  return () => {
    if (waveContractAddress) {
      waveContractAddress.off('NewWave', onNewWave);
    }
  };
}, []);

  const CheckIfWalletIsConnected = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask! Get it from metamask.io');
        return;
      }
      else {
        console.log('We have our ethereum wallet', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('This is an authorized account:', account);
        setCurrentAccount(account);
        getAllWaves();
      }
      else {
        console.log('Authorised Account not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get Metamask');
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try{
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContractAddress = new ethers.Contract(contractAddress,contractABI, signer);

        const message = document.getElementById('msg').value;
        console.log("Waving a new message: ", message);

        const waveTransaction = await waveContractAddress.wave(message,{ gasLimit: 300000 });
        console.log('Mining.........',waveTransaction.hash);

        await waveTransaction.wait();
        console.log('Mined!',waveTransaction.hash);

        getAllWaves();
      }else{
        console.log('Ethereum object not find');
      }

    }catch(error){
      console.log(error);
    }

    
  }

 
  useEffect(() => {
    CheckIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Medha, currently learning blockchain dev. Its always good to connect with people. Connect your Ethereum wallet and wave!
  
          Who knows you might earn some ether in the process. ;)
        </div>

        
        <div className="msg">
          <input class ="message" id='msg' type ="text" placeholder="Your message for Medha"/>
          <button className="waveButton" onClick={wave}>
            Wave
          </button>
        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div className ="msg-box" key={index} style={{ backgroundColor: "#EFEFEF", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}


export default App;