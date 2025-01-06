"use client";
import { useEffect, useState } from "react";
import "../Container-Component/Container-Component-Styles.css";
interface ExchangeRates {
  [currency: string]: string;
}
interface ApiResponse {
  rates: ExchangeRates;
}

const ContainerComponent = () => {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
        const BASE_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;
        const res = await fetch(BASE_URL, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Falha ao buscar dados da API");
        }
        const data: ApiResponse = await res.json();
        setRates(data.rates);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const convertCurrency = () => {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (fromRate && toRate) {
      const convertedValue =
        (amount / parseFloat(fromRate)) * parseFloat(toRate);
      setResult(convertedValue);
    } else {
      setResult(null);
      alert("Selecione moedas válidas.");
    }
  };

  return (
    <div className="Container">
      <h1 className="title">Conversor de Moedas</h1>
      <div className="Content-container">
        {/* Valor a ser convertido */}
        <div className="first-label">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <label>Valor:</label>
        </div>

        {/* Moeda de origem */}
        <div className="from-Currency">
          <label>
            De:
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Moeda de destino */}
        <div className="to-Currency">
          <label>
            Para:
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Botão para converter */}

        <button className="Custom-BTN" onClick={convertCurrency}>
          {" "}
          Converter
        </button>

        {/* Resultado da conversão */}
        {result !== null && (
          <div className="Results">
            <h2 className="text-results">Resultado</h2>
            <p className="value-results">
              {amount} {fromCurrency} = {result.toFixed(3)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerComponent;
