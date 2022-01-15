import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Poll from "./contracts/Poll.json";
import getWeb3 from "./getWeb3";
import ListGroup from "react-bootstrap/ListGroup";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    allCoins: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];

      const deployedNetworkPoll = Poll.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const poll = new web3.eth.Contract(
        Poll.abi,
        deployedNetworkPoll && deployedNetworkPoll.address
      );

      const res = await poll.methods.getTotalCoins().call();

      let allCoins = {};

      for (var i = 1; i <= res; i++) {
        let coin = await poll.methods.coins(i).call();
        allCoins[i] = {
          id: i,
          name: coin.name,
          firstPlaceCount: coin.firstPlaceCount,
        };
      }
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contracts: [instance, poll],
        coins: res,
        allCoins: allCoins,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3 || !this.state.allCoins) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const listItems = Object.keys(this.state.allCoins).map((id) => {
      return <ListGroup.Item key={id}>{this.state.allCoins[id]["name"]}</ListGroup.Item>;
    });
    return (
      <>
        <div>The are {this.state.coins} coins</div>
        <div>Hello world</div>
        <ListGroup>{listItems}</ListGroup>
      </>
    );
  }
}

export default App;
