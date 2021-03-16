import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import {getAccountData} from '../helpers';

import Color from '../abis/Color.json';

// cooper s - remix address
// truffle address
const localAddr = '0xE9044577A8014a630f080657F657d57D1F2831C0'; 

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {

    console.log("load blockchain: ", window.web3 )
    const web3 = window.web3;
    // Load account

    //cooper s - get  all the account data at once....
    console.log("Get account data...")
    const accountData = await getAccountData(web3)
    console.log("accountData: ", accountData );

    this.setState({account: accountData.account });
    this.setState({accountName: accountData.accountName});
    this.setState ({balance: window.web3.utils.fromWei(accountData.accountBalance)});
    this.setState ({networkId: accountData.networkInfo.network} );

    //imported Color contract, non-network
    console.log("non-network color contract address: ", Color.address )
    console.log("non-network color contract: ", Object.entries(Color.networks))

        // Identify which network we're on
        let networkId = accountData.networkInfo.id;
        console.log("Current network ID: ", networkId)
        const networkData = ''; //Color.networks[networkId]
        console.log("networkData: ", networkData )

        // working from the local ganache blockchain
        if (networkId === 5777) {
          console.log("create local contract");

          const colorContract = new web3.eth.Contract(Color.abi, localAddr);
          console.log("Color Contract: ", colorContract );
      
          this.setState({ contract: colorContract })
          this.setState({contractAddr: colorContract.address})

          console.log("contract methods", this.state.contract.methods );

          let contractName = await colorContract.methods.name().call();
          console.log("contractName: ", contractName )
          this.setState({contractName})
      
          const totalSupply = await colorContract.methods.totalSupply().call()
          console.log("Total Supply: ", totalSupply )
      
          this.setState({ totalSupply })
            // Load Colors
            for (var i = 1; i <= totalSupply; i++) {
              const color = await colorContract.methods.colors(i - 1).call();
              console.log("Selected color: ", color )
              this.setState({
                colors: [...this.state.colors, color]
              })
            } 

        }//end ganache network

  // Ropsten Network  
        if (networkId === 3) {
          console.log("create ropsten contract")
          
          const colorContract = new web3.eth.Contract(Color.abi, "0x4007b247e098B82f12212f40Cb8B9022e822BF15"); 

          console.log("Color Contract: ", colorContract );
      
          this.setState({ contract: colorContract })
          this.setState({contractAddr: colorContract.address})

          let contractName = await colorContract.methods.name().call();
          console.log("contractName: ", contractName );
          this.setState({contractName})
      
          const totalSupply = await colorContract.methods.totalSupply().call()
          console.log("Total Supply: ", totalSupply )
      
          this.setState({ totalSupply })
            // Load Colors
            for (var i = 1; i <= totalSupply; i++) {
              const color = await colorContract.methods.colors(i - 1).call()
              this.setState({
                colors: [...this.state.colors, color]
              })
            }
       
        }//end ropsten contract

        if (networkData) {
        
        }//end iffy 
            
  } //end loadBlockChainData

  mint = (color) => {
    console.log("Mint some coin buddy: " , color, " from: ", this.state.account )

    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log("here's your receipt...");
      this.setState({
        colors: [...this.state.colors, color]
      })
    }) 
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      balance: 0,
      contract: null,
      contractName:'',
      contractAddr: '',
      totalSupply: 0,
      colors: [],
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Digtal Art Blockchain Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
        <div className="row intro">
          To purchase a digital Collector's item, connect to your Metamask wallet and select the Ropsten Test Network. Ropsten is currently the only network where you can access the DAB tokens.
          Once you have decided upon an item, click the "MINT" button to add your NFT to the blockchain with your uniquie signature. 
          (For demonstration purposes an item is represented by a particular number).
          <ul>
            <li>#FF00FF: Item 1</li>
            <li>#FF0000: Item 2</li>
            <li>#333333: Item 3</li>
          </ul>
          The ETH will be deducted from your Metamask Account so be sure you can afford your selection.
          Each Token will be created with your own signature so only you can transfer, i.e., sell it other on network. 
          In addition, future versions will allow you accumulate 10% each time your Token is sold in perpetuity. 
          <br/>
          <p><b>Remember</b> this is a prototype for demonstration purposes only. No actual ETHEREUM will be consumed.</p>
        </div>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center gallery">
              <div className="content mr-auto ml-auto goodie">
                <p className="header-font">Item #1</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  //const color = this.color.value
                  const color = "#FF00FF";
                  this.mint(color)
                }}>

                  <img src="https://sonyainc.net/images/nft/crypto-lisa.png" className="App-logo" alt="logo" height="300" width="300" />
                  <br/>
                  <div><label > Price: 1 ETH</label></div>

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
              <div className="content mr-auto ml-auto goodie">
              <p className="header-font">Item #2</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  //const color = this.color.value
                  const color = "#FF0000";
                  this.mint(color)
                }}>
                  <img src="https://sonyainc.net/images/nft/bp_01.jpg" className="App-logo" alt="logo" height="300" width="300" />
                  <br/>
                  <div><label > Price: 5 ETH</label></div>

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
              <div className="content mr-auto ml-auto goodie">
              <p className="header-font">Item #3</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  //const color = this.color.value
                  const color = "#333333";
                  this.mint(color)
                }}>

<img src="https://sonyainc.net/images/nft/terminator.jpeg" className="App-logo" alt="logo" height="300" width="300" />
                  <br/>
                  <div><label > Price: 10 ETH</label></div>

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
          <div className ="text-left">
                  <b>Network:</b> {this.state.networkId}
                  <br/>
                  <b>Account:</b> {this.state.accountName} 
                  <br/>
                  <b>Account Balance:</b> {this.state.balance }  ETH
                  <br/>
                  <div>
                  <b>Contract Name: </b> {this.state.contractName}
                  <br />
                  <b>Contract Address: </b> {this.state.contractAddr}
                </div>
            </div> 
            <p>credit: Dapp University</p>
        </div>
      </div>
    );
  }
}

export default App;
