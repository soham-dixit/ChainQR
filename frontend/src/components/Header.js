import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { GoogleLogin } from "@react-oauth/google";
import { useOkto } from "okto-sdk-react";
import axios from "axios";

import styles from "./css/Home.module.css";

export default function Example() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useOkto();

  const clientId =
    "BMkIcnCDXsPdrCPRI87Aleozma75z4EGhrxDzjD9dD5E9GsRekIVd4OMXN5Tiv1A4Wa4bs8DR651gyp_F1WA8Hs";

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
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    localStorage.setItem("user", JSON.stringify(provider));
    navigate("/upiform");
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        setAuthToken(authResponse.auth_token);
        console.log(
          "Authenticated successfully, auth token:",
          authResponse.auth_token
        );

        const options = {
          method: "GET",
          url: "https://sandbox-api.okto.tech/api/v1/user_from_token",
          headers: { Authorization: `Bearer ${authResponse.auth_token}` },
        };

        await axios
          .request(options)
          .then((res) => {
            setUserName(res.data.data.email);
            navigate("/upiform");
          })
          .catch((err) => {
            console.log(`The Error is oocured : ${err}`);
          });
      } else if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  return (
    <>
      {!authToken ? (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(error) => console.error("Login Failed", error)}
        />
      ) : (
        <>
          <p>Logged in as: {userName}</p>
        </>
      )}

      <div className={styles.home}>
        <button onClick={login} className={styles.heading}>
          Enter into ChainQR
        </button>
      </div>
    </>
  );
}
