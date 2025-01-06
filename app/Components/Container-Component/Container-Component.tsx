"use client";
import { useEffect, useState } from "react";
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

  function formatRate(rate: string): string {
    const rateNumber = parseFloat(rate);
    return rateNumber.toFixed(3);
  }

  return (
    <div>
      <h1>Container</h1>
      {Object.entries(rates).map(([currency, rate]) => (
        <li key={currency}>
          {currency}: {formatRate(rate)}
        </li>
      ))}
    </div>
  );
};

export default ContainerComponent;
