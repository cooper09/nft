import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import {getAccountData} from '../helpers';

import Color from '../abis/Color.json'

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
    const web3 = window.web3
    // Load account

    //cooper s - get  all the account data at once....
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

        if (networkId === 5777) {
          console.log("create local contract");

        }
    
        if (networkId === 3) {
          console.log("create ropsten contract")
          const colorContract = new web3.eth.Contract(Color.abi, "0xa528e222279A2A5d773999fD49AfC03352Ad6bFA");
          console.log("Color Contract: ", colorContract );
      
          this.setState({ contract: colorContract })
          this.setState({contractAddr: colorContract.address})

          let contractName = await colorContract.methods.name().call();
          console.log("contractName: ", contractName )
      
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

          const colorContract = new web3.eth.Contract(Color.abi, "0xa528e222279A2A5d773999fD49AfC03352Ad6bFA");
          console.log("Color Contract: ", colorContract );
      
          this.setState({ contract: colorContract })
          this.setState({contractAddr: colorContract.address})
      
          let contractName = await colorContract.methods.name().call();
          console.log("contractName: ", contractName )
      
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
        }//end iffy 
            
    //const networkId = await web3.eth.net.getId()
    //console.log("Network: ", networkId )

    //console.log("Color Contract: ", Color)
  //if netwworkid = 5777
  //  then create localhost contract
  
  //if newtorkId = 3 (Ropsten)
  // then create ropsten contract
 /*   const colorContract = new web3.eth.Contract(Color.abi, "0xa528e222279A2A5d773999fD49AfC03352Ad6bFA");
    console.log("Color Contract: ", colorContract );

    this.setState({ contract: colorContract })
    this.setState({contractAddr: colorContract.address})

    let contractName = await colorContract.methods.name().call();
    console.log("contractName: ", contractName )

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
*/

    //const networkData = ""; //colorContract.networks[networkId]
    //console.log("Color Contract Address: ", networkData ) 
/*
    if(networkData) {
      console.log("we're on the net!")
      const abi = Color.abi
      //const address = networkData.address
      const address = "0xfe24a992a6cc6fab458a5ce655575f464ab35ca4"
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network: ', networkId)
    } //end iffy */
  } //end loadBlockChainData

  mint = (color) => {
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
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
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center gallery">
              <div className="content mr-auto ml-auto goodie">
                <h1>Item #1</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>

                  <img src="https://via.placeholder.com/200" className="App-logo" alt="logo" />
                  <br/>
                  <div><label > Price 1 ETH</label></div>

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
              <div className="content mr-auto ml-auto goodie">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="https://via.placeholder.com/150" className="App-logo" alt="logo" />
                </a>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
              <div className="content mr-auto ml-auto goodie">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="https://via.placeholder.com/150" className="App-logo" alt="logo" />
                </a>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
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
        </div>
      </div>
    );
  }
}

export default App;
