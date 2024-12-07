import { Fragment, useState,useEffect } from 'react'

import { Link } from 'react-router-dom';

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { useNavigate } from 'react-router-dom';

import styles from './css/Home.module.css'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const navigate=useNavigate();

  // const clientId =
  // "BAVJ1sL2vQytfij3dmhWfEnzm6qYiH-vw-nq7GB2OF3it-Gqz-IVQ20Vf25rTZptrGR0xTOKL8LuPcsAboeZtOs";
  // const clientId =
  // "BH7iRq-5-lZRklOuS5N5KBzjs_Tj88XtFgNMvpaRGcNA-i89ai2x47eIQvfI0jegsTvF5Tom4vZTYm7lHZDrzag";
  const clientId =
  "BMRK2HAmHBpmz5d2ouTDc0haOrZVXkeWjV06ey3H-tQBi14BAhou626rKQm_-IUjoSQ5hbs3ruk_OkrD8j06fs8";
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
      localStorage.setItem('user',JSON.stringify(provider));
      // getAccounts();
      // setLoginwindow(false);
      navigate('/upiform');
  
    };

  return (
    <div className={styles.home}>
      <button onClick={login} className={styles.heading}> Web3 Cred </button>
    </div>
  )
}
