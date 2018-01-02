import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { btsBt:1 , btsPr:1, bfnPr:1, bfnBt:1, 
      btsCexXrpUsd: 1, btsCexXrpEur:1 , btsCexBtcUsd: 1, btsCexBtcEur: 1 ,
      bfnCexXrpUsd: 1, bfnCexBtcUsd: 1, bfnCexBtcEur: 1 
      };  
  }
  
  componentDidMount() {
    this.tickArb();
    this.tickPrice();
  }

  tickArb() {
    this.getUsdTRY().then(result => { 
      this.getBtcTurkBTCTRY(result).then(ratedBtcTurk => {
        this.getBtcTurkETHTRY(result).then(ratedBtcTurkEth => {
          this.getParibuBTCTRY(result).then(ratedParibu => {
            this.getCexBTCEUR().then(cexBtcEur => {
              this.getCexBTCUSD().then(cexBtcUsd => {
                this.getCexXRPEUR().then(cexXrpEur => {
                  this.getCexXRPUSD().then(cexXrpUsd => {
                    this.getBtsArb(ratedBtcTurk, ratedParibu, cexBtcUsd).then(btsArb => {
                      this.getBfnArb(ratedBtcTurk, ratedParibu, cexBtcUsd).then(bfnArb => {
                        this.getBtsBtcEurArb(cexBtcEur).then(btsBtcEurArb => {
                          this.getBtsXrpEurArb(cexXrpEur).then(btsXrpEurArb => {
                            this.getBtsXrpUsdArb(cexXrpUsd).then(btsXrpUsdArb => {
                              this.getBfnBtcEurArb(cexBtcEur).then(bfnBtcEurArb => {
                                this.getBfnXrpUsdArb(cexXrpUsd).then(bfnXrpUsdArb => {
                                  

                              this.setState({ btsBt: btsArb.ab, 
                                bfnBt: bfnArb.ab, 
                                btsPr: btsArb.ap,  
                                bfnPr: bfnArb.ap,
                                btsCexBtcUsd: btsArb.cex,
                                bfnCexBtcUsd: bfnArb.cex,
                                btsCexXrpEur: btsXrpEurArb.cex,
                                btsCexBtcEur: btsBtcEurArb.cex,
                                btsCexXrpUsd: btsXrpUsdArb.cex,
                                bfnCexXrpUsd: bfnXrpUsdArb.cex,
                                bfnCexBtcEur: bfnBtcEurArb.cex
                              });


                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
  }
  
  tickPrice() {
    setTimeout(() => {
        this.tickArb();
        this.tickPrice();
    }, 10000); //tick every 500 - 1500 ms
  }
  
  getBfnArb(rateB, rateP, rateC) {
    return fetch('https://api.bitfinex.com/v2/ticker/tBTCUSD')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson[2];
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100 , 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getBfnBtcEurArb(rateC) {
    return fetch('https://api.bitfinex.com/v2/ticker/tBTCEUR')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson[2];
        const result = { 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getBfnXrpUsdArb(rateC) {
    return fetch('https://api.bitfinex.com/v2/ticker/tXRPUSD')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson[2];
        const result = { 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }
 
  
  getBtsArb(rateB, rateP, rateC) {
    return fetch('https://www.bitstamp.net/api/ticker')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.ask;
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100, 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getBtsBtcEurArb(rateC) {
    return fetch('https://cors-anywhere.herokuapp.com/https://www.bitstamp.net/api/v2/ticker/BTCEUR/')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.ask;
        const result = { 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
        return { 'cex' : ((rateC / 1) - 1) * 100 }; 
      console.error(error);
    });
  }

  getBtsXrpEurArb(rateC) {
    return fetch('https://cors-anywhere.herokuapp.com/https://www.bitstamp.net/api/v2/ticker/XRPEUR/')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.ask;
        const result = { 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
        return { 'cex' : ((rateC / 1) - 1) * 100 }; 
      console.error(error);
    });
  }

  getBtsXrpUsdArb(rateC) {
    return fetch('https://cors-anywhere.herokuapp.com/https://www.bitstamp.net/api/v2/ticker/XRPUSD/')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.ask;
        const result = { 'cex' : ((rateC / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      return { 'cex' : ((rateC / 1) - 1) * 100 }; 
      console.error(error);
    });
  }
  
  getParibuBTCTRY(rate) {
    
    var myHeaders = new Headers();

    var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'no-cors',
               cache: 'default' };
    
    return fetch('https://cors-anywhere.herokuapp.com/https://www.paribu.com/ticker')
      .then((response) => { console.log(response);  return response.json();} )
      .then((responseJson) => {
        console.log(responseJson);
        return responseJson.BTC_TL.highestBid / rate;
    })
      .catch((error) => {
      console.error(error);
    });
  }
  
  getBtcTurkBTCTRY(rate) {
    return fetch('https://www.btcturk.com/api/ticker?pairSymbol=BTCTRY')
      .then((response) => response.json())
      .then((responseJson) => {
      return responseJson.bid / rate;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getBtcTurkETHTRY(rate) {
    return fetch('https://www.btcturk.com/api/ticker?pairSymbol=ETHTRY')
      .then((response) => response.json())
      .then((responseJson) => {
      return responseJson.bid / rate;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getUsdTRY() {
    return fetch('https://www.doviz.com/api/v1/currencies/USD/latest')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.buying);
      return responseJson.buying;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getCexXRPUSD() {
    return fetch('https://cors-anywhere.herokuapp.com/https://cex.io/api/ticker/XRP/USD')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.bid;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getCexXRPEUR() {
    return fetch('https://cors-anywhere.herokuapp.com/https://cex.io/api/ticker/XRP/EUR')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.bid;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getCexBTCEUR() {
    return fetch('https://cors-anywhere.herokuapp.com/https://cex.io/api/ticker/BTC/EUR')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.bid;
    })
      .catch((error) => {
      console.error(error);
    });
  }
  
  getCexBTCUSD() {
    return fetch('https://cors-anywhere.herokuapp.com/https://cex.io/api/ticker/BTC/USD')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.bid;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  render() {
    
    return (
      <div class="container">
        <div class="row">
          <div class="col-sm">
            Bitstamp-BtcTurk: {this.state.btsBt}
          </div>
          <div class="col-sm">
            Bitfinex-BtcTurk: {this.state.bfnBt}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm">
            Bitstamp-Paribu: {this.state.btsPr}
          </div>
          <div class="col-sm">
            Bitfinex-Paribu: {this.state.bfnPr}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm">
            Bitstamp-Cex XrpUsd: {this.state.btsCexXrpUsd}
          </div>
          <div class="col-sm">
            Bitstamp-Cex XrpEur: {this.state.btsCexXrpEur}
          </div>
          <div class="col-sm">
            Bitstamp-Cex BtcUsd: {this.state.btsCexBtcUsd}
          </div>
          <div class="col-sm">
            Bitstamp-Cex BtcEur: {this.state.btsCexBtcEur}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm">
            Bitfinex-Cex XrpUsd: {this.state.bfnCexXrpUsd}
          </div>
          <div class="col-sm">
          Bitfinex-Cex BtcUsd: {this.state.bfnCexBtcUsd}
          </div>
          <div class="col-sm">
          Bitfinex-Cex BtcEur: {this.state.bfnCexBtcEur}
          </div>
        </div>
      </div>
    );
  }
}
  
class TickerApp extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='container'>
        <h1>SIFIRLADIM</h1>
        <Tile />
      </div>
    );
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className='container'>
          <h1>SIFIRLADIM</h1>
          <Tile />
        </div>
      </div>
    );
  }
}

export default App;
