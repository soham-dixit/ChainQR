import React from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "../web3RPC";
import { useState, useEffect } from "react";
import convert from "./apnaCryptoConvert";

import styles from "./css/Scanner.module.css";

export default function MicroInvestment() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [withdrawAmount, setWithdrawamount] = useState(0);
  const [contractBalance, setContractbalance] = useState(0);
  // const clientId =
  //   "BMkKHE4n2KgzLWFXDmpCVIpWMggQ8Pe8_4pRkbm9aNafKnn0WRlb1zoy6JlOh2nN2Aw54jIAbFbsAUut3tuJr8w";
  const clientId =
    "BMRK2HAmHBpmz5d2ouTDc0haOrZVXkeWjV06ey3H-tQBi14BAhou626rKQm_-IUjoSQ5hbs3ruk_OkrD8j06fs8";

  const sendGetContractBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const pubKey = localStorage.getItem("publicAddress");

    let contractAddress = await fetch(
      `http://localhost:5000/getContractAdress/${pubKey}`,
      {
        method: "get",
        headers: { "Content-Type": "application/json" },
      }
    );
    contractAddress = await contractAddress.json();
    const rpc = await new RPC(provider);
    const balance = await rpc.getContractBalance(contractAddress.address);
    console.log(balance);
    setContractbalance(balance);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x14a34",
            rpcTarget: "https://sepolia.base.org/",
          },
          web3AuthNetwork: "aqua",
        });
        setWeb3auth(web3auth);
        await web3auth.initModal();
        setProvider(web3auth.provider);
        console.log(provider);

        const pubKey = localStorage.getItem("publicAddress");

        let contractAddress = await fetch(
          `http://localhost:5000/getContractAdress/${pubKey}`,
          {
            method: "get",
            headers: { "Content-Type": "application/json" },
          }
        );
        contractAddress = await contractAddress.json();
        const rpc = await new RPC(web3auth.provider);
        const balance = await rpc.getContractBalance(contractAddress.address);
        console.log(balance);
        setContractbalance(balance);
      } catch (error) {
        console.error(error);
      }
    };
    init();
    sendGetContractBalance();
  }, []);

  const sendWithdrawTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const pubKey = localStorage.getItem("publicAddress");

    let contractAddress = await fetch(
      `http://localhost:5000/getContractAdress/${pubKey}`,
      {
        method: "get",
        headers: { "Content-Type": "application/json" },
      }
    );
    contractAddress = await contractAddress.json();

    const rpc = new RPC(provider);
    const receipt = await rpc.withdrawTransaction(contractAddress.address);
    console.log(receipt);
  };

  return (
    <div>
      <div className={styles.section} style={{ flexDirection: "column" }}>
        {/* <input type='text' onChange={(e)=>setWithdrawamount(e.target.value)}/> */}
        <div className={styles.welcomeText}>
          Saved amount: {convert.MATIC.INR(parseFloat(contractBalance))}
        </div>
        <br></br>
        <div style={{ display: "flex", gap: "2vw" }}>
          <button
            className={styles.upiButton}
            onClick={sendWithdrawTransaction}
          >
            Withdraw
          </button>
          {/* <a href='http://localhost:3001/#/pools' target='_blank' className={styles.upiButton}>Liquidity Pools</a>
            <a href='http://127.0.0.1:5500/price-details.html' target='_blank' className={styles.upiButton}>Tokenized Stocks</a> */}
          <a
            href="https://frontend-closedcred-uniswap.vercel.app/pools"
            target="_blank"
            className={styles.upiButton}
          >
            Liquidity Pools
          </a>
          <a
            href="https://frontend-closedcred-stockex.vercel.app/price-details.html"
            target="_blank"
            className={styles.upiButton}
          >
            Tokenized Stocks
          </a>
        </div>
      </div>
      <div className={styles.home}></div>
    </div>
  );
}
