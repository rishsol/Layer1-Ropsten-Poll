import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    /*
    const provider = new Web3.providers.HttpProvider(
      "http://127.0.0.1:8545"
    );
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    resolve(web3);
    */
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      
        if(typeof window.ethereum !== 'undefined') {
          const web3 = new Web3(window.ethereum);
          window.ethereum.enable()
            .then(() => {
              resolve(
                new Web3(window.ethereum)
              );
            })
            .catch(e => {
              reject(e);
            });
          return;
        }
        if(typeof window.web3 !== 'undefined') {
          return resolve(
            new Web3(window.web3.currentProvider)
          );
        }
        resolve(new Web3('http://localhost:8545'));
      });
    });

export default getWeb3;
