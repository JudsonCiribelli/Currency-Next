"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
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
        (amount / parseFloat(fromRate)) * parseFloat(toRate); // Cálculo de conversão
      setResult(convertedValue);
    } else {
      setResult(null);
      alert("Selecione moedas válidas.");
    }
  };

  return (
    <div>
      <h1>Conversor de Moedas</h1>
      <div>
        {/* Valor a ser convertido */}
        <div>
          <label>
            Valor:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Moeda de origem */}
        <div>
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
        <div>
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
        <Button variant={"secondary"} onClick={convertCurrency}>
          Converter
        </Button>

        {/* Resultado da conversão */}
        {result !== null && (
          <div>
            <h2>Resultado:</h2>
            <p>
              {amount} {fromCurrency} = {result.toFixed(3)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerComponent;
