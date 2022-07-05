import './App.css';
import CurrencyInput from "./CurrencyInput";
import {useState, useEffect} from "react";
import Axios from "axios";


function App() {

  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('EUR');
  const [rates, setRates] = useState([]);
  const [firstHeader, setFirstHeader] = useState()
  const [secondHeader, setSecondHeader] = useState()

  useEffect(() => {
      Axios.get('https://api.exchangerate.host/latest')
      .then(response => {
        setRates(response.data.rates);
        console.log(response,"res")
      })
  }, []);

  useEffect(() => {
    if (!!rates) {
      function init() {
        handleAmount1Change(1);
      }
      init();
    }
  }, [rates]);

  useEffect(() => {
    Axios.get('https://api.exchangerate.host/latest?data&base=USD&places=2')
    .then(res=> {
      return res.data.rates
    })
    .then(value => {
      setFirstHeader(value.UAH)
    })
    Axios.get('https://api.exchangerate.host/latest?data&base=EUR&places=2')
    .then(res=> {
      return res.data.rates
    })
    .then(svalue => {
      setSecondHeader(svalue.UAH)
    })
    
  },[firstHeader,secondHeader])

  function roundUp(number) {
    return number.toFixed(4);
  }

  function handleAmount1Change(amount1) {
    setAmount2(roundUp(amount1 * rates[currency2] / rates[currency1]));
    setAmount1(amount1);
  }

  function handleCurrency1Change(currency1) {
    setAmount2(roundUp(amount1 * rates[currency2] / rates[currency1]));
    setCurrency1(currency1);
  }

  function handleAmount2Change(amount2) {
    setAmount1(roundUp(amount2 * rates[currency1] / rates[currency2]));
    setAmount2(amount2);
  }

  function handleCurrency2Change(currency2) {
    setAmount1(roundUp(amount2 * rates[currency1] / rates[currency2]));
    setCurrency2(currency2);
  }

  return (
    <div className='body'>
      <section className="input-container">
          <span className='header-data'>
            <p className='usd-val'>USD = {firstHeader} UAH</p>
            <p className='eur-val'>EUR = {secondHeader} UAH</p>
          </span>
        <div className="input-div">
          <h1 className="currency-converter"
          >Currency Converter</h1>
          <CurrencyInput
            onAmountChange={handleAmount1Change}
            onCurrencyChange={handleCurrency1Change}
            currencies={Object.keys(rates)}
            amount={amount1}
            currency={currency1} 
          />
          
          <CurrencyInput
            onAmountChange={handleAmount2Change}
            onCurrencyChange={handleCurrency2Change}
            currencies={Object.keys(rates)}
            amount={amount2}
            currency={currency2} 
          />
        </div>
      </section>
    </div>
  );
}

export default App;