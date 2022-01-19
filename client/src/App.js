import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Poll from "./contracts/Poll.json";
import getWeb3 from "./getWeb3";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./DND.css";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

let totalCoins = 3;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  textAlign: "center",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  margin: "auto",
});

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contracts: null,
    allCoins: null,
    coinNames: null,
  };

  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  compare = (a, b) => {
    if (a.firstPlaceCount > b.firstPlaceCount) {
      return -1;
    }

    if (a.firstPlaceCount < b.firstPlaceCount) {
      return 1;
    }

    if (a.secondPlaceCount > b.secondPlaceCount) {
      return -1;
    }

    if (a.secondPlaceCount < b.secondPlaceCount) {
      return 1;
    }

    if (a.thirdPlaceCount > b.thirdPlaceCount) {
      return -1;
    }

    if (a.thirdPlaceCount < b.thirdPlaceCount) {
      return 1;
    }
  }

  setCoins = async (totalCoins) => {
    let allCoins = [];
    let coinNames = [];
    for (var i = 1; i <= totalCoins; i++) {
      let coin = await this.state.contracts[1].methods.coins(i).call();
      coinNames.push({ id: i, name: coin.name });
      allCoins.push({
        id: i,
        name: coin.name,
        firstPlaceCount: coin.firstPlaceCount,
        secondPlaceCount: coin.secondPlaceCount,
        thirdPlaceCount: coin.thirdPlaceCount,
      });
    }
    allCoins.sort(this.compare);
    console.log(allCoins);
    this.setState({ allCoins: allCoins, coinNames: coinNames });
  };

  rankCoins = async (list) => {
    if (this.state.contracts != null) {
      let coinIds = [];
      for (var i = 0; i < list.length; i++) {
        coinIds.push(list[i]["id"]);
      }
     
      await this.state.contracts[1].methods
          .rank(coinIds)
          .send({ from: this.state.accounts[0] });
      await this.setCoins(totalCoins);
    } else {
      return;
    }
  };

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const coinNames = reorder(
      this.state.coinNames,
      result.source.index,
      result.destination.index
    );

    this.setState({
      coinNames: coinNames,
    });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      console.log(accounts);

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
      console.log(poll);

      totalCoins = await poll.methods.getTotalCoins().call();

      this.setState({
        web3,
        accounts,
        contracts: [instance, poll],
        coins: totalCoins,
      });

      await this.setCoins(totalCoins);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
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
    const listItems = Object.keys(this.state.allCoins).map((id) => (
      <ListGroup.Item key={id}>
        {this.state.allCoins[id]["name"]}
      </ListGroup.Item>
    ));
    return (
      <>
        <ListGroup>{listItems}</ListGroup>
        <div className="App">
          <h1>Layer 1 Protocol Olympics!</h1>
          <p>
            Drag-and-Drop the protocols below to submit your vote to the Ropsten
            Ethereum testnet.
          </p>
        </div>
        <DragDropContext className="DND" onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.coinNames.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <span></span>
        <span></span>
        <Button
          className="DND"
          onClick={this.rankCoins.bind(this, this.state.coinNames)}
        >
          Rank!
        </Button>
        <Table responsive className="table">
          <thead>
            <tr>
              <th>Layer 1 Coin</th>
              <th key="gold">Gold</th>
              <th key="silver">Silver</th>
              <th key="bronze">Bronze</th>
            </tr>
          </thead>
          <tbody>
            {this.state.allCoins.map((coin) => (
              <tr>
                <td key={coin.name}>{coin.name}</td>
                <td key={coin.name + "1"}>{coin.firstPlaceCount}</td>
                <td key={coin.name + "2"}>{coin.secondPlaceCount}</td>
                <td key={coin.name + "3"}>{coin.thirdPlaceCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export default App;
