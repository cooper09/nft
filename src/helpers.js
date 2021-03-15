
//slideshow.js
export const doSomething = (n)=>{
    return(" I hear and I obey!!");
}

export  const getAccountData = async (web3) =>{
  //console.log("getAccountData: ", web3)
  // get account info

  const accounts = await web3.eth.getAccounts();
  const accountName = await getAccountName(accounts[0]);
  //console.log("getAccountData.accountName ", accountName )
  const balance = await web3.eth.getBalance(accounts[0]);

          //cooper s - can we capture the network
          const networkId = await web3.eth.net.getId();
          //console.log("network connected: ", networkId )
  
          let networkName =  getNetworkName (networkId)
          //console.log("network name: ", networkName )

  let acctObj = {
    account: accounts[0],
    accountName : accountName,
    accountBalance: balance,
    networkInfo: {
      id: networkId,
      network: networkName
    }

  }
  return acctObj;
}
export const getAccountName = (account) => {
    //console.log("getAccountName: ", account)
    let accountName;
    switch (account) {
      case '0xC6b2DFf9776fe2c18c7FC38f25b2c27fA7e8E937':
        console.log("Account 1")
        accountName = "Account 3"
      break
      case '0x00c3e8976ae622C79C6e33749eF999aa9ECba3c1':
        console.log("Primary")
        accountName = "Primary"
      break
      case '0xFD5D8ae0d003f81cc20971C7d37e806bbaBD50C2':
        console.log("Dev")
        accountName = "Dev"
      break
      case '0xF7734EE50E5623333aeBCaD0d03D2c16598FED27':
        console.log("Account 4")
        accountName = "Account 4"
      break
      case '0x42977ca2fC4d2E3372a01213c0b8955702E1A3af':
        console.log("Local Ganache Account")
        accountName = "Local Ganache 9545"
      break
      default:
        accountName = "Not Selected"  
    }//end switch
    return accountName
  }

  export const getNetworkName = (id) => {
    console.log("getNetworkName: ", id);
    let networkName;

    switch (id) {
      case 1:
        console.log("mainnet")
        networkName = "mainnet"
      break
      case 3:
        console.log("ropsten")
        networkName = "ropsten"
      break
      case 4:
        console.log("rinkeby")
        networkName = "rinkeby"
      break
      case 5:
        console.log("goerli")
        networkName = "goerli"
      break
      case 42:
        console.log("kovan")
        networkName = "kovan"
      break
      case 5777:
        console.log("local ganache")
        networkName = "local ganache"
      break
      default:
        networkName = "Not Selected"  
    }//end switch

    return networkName;
  }//end getNetworkName
