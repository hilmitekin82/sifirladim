import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { btsBt:1 , btsPr:1, krkPr:1, bfnPr:1, krkBt:1 , bfnBt:1, krkBtEth:1 };  
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
            this.getBtsArb(ratedBtcTurk, ratedParibu).then(btsArb => {
              this.getKrkArb(ratedBtcTurk, ratedParibu).then(krkArb => {
                this.getKrkArbEth(ratedBtcTurkEth, ratedBtcTurkEth).then(krkArbEth => {
                  this.getBfnArb(ratedBtcTurk, ratedParibu).then(bfnArb => {
                    this.setState({ btsBt: btsArb.ab, krkBt: krkArb.ab, bfnBt: bfnArb.ab, btsPr: btsArb.ap, krkPr: krkArb.ap, bfnPr: bfnArb.ap, krkBtEth: krkArbEth.ab });
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
    }, 5000); //tick every 500 - 1500 ms
  }
  
  getBfnArb(rateB, rateP) {
    return fetch('https://api.bitfinex.com/v2/ticker/tBTCUSD')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson[2];
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }
  
  getKrkArb(rateB, rateP) {
    return fetch('https://cors-anywhere.herokuapp.com/'+'https://api.kraken.com/0/public/Ticker?pair=XBTUSD')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.result.XXBTZUSD.a[0];
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }

  getKrkArbEth(rateB, rateP) {
    return fetch('https://cors-anywhere.herokuapp.com/'+'https://api.kraken.com/0/public/Ticker?pair=ETHUSD')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.result.XETHZUSD.a[0];
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
      console.error(error);
    });
  }
  
  getBtsArb(rateB, rateP) {
    return fetch('https://www.bitstamp.net/api/ticker')
      .then((response) => response.json())
      .then((responseJson) => {
        const price = responseJson.ask;
        const result = { 'ab' : ((rateB / price) - 1) * 100, 'ap' : ((rateP / price) - 1) * 100 };  
        return result;
    })
      .catch((error) => {
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
    return fetch('https://api.fixer.io/latest?base=USD&from=TRY&to=TRY')
      .then((response) => response.json())
      .then((responseJson) => {
      return responseJson.rates.TRY;
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
            Kraken-BtcTurk: {this.state.krkBt}
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
            Kraken-Paribu: {this.state.krkPr}
          </div>
          <div class="col-sm">
            Bitfinex-Paribu: {this.state.bfnPr}
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-sm">
            Kraken-BtcTurk ETH: {this.state.krkBtEth}
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
