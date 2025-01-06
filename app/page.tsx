interface ExchangeRates {
  [currency: string]: string;
}
interface ApiResponse {
  rates: ExchangeRates;
}

export default async function Home() {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const BASE_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

  const res = await fetch(BASE_URL, { cache: "no-store" }); // 'no-store' evita cache
  const data: ApiResponse = await res.json();

  const rates = data.rates;

  return (
    <div>
      <h1>Taxas de Câmbio</h1>
      <ul>
        {Object.entries(rates).map(([currency, rate]) => (
          <li key={currency}>
            {currency}: {rate}
          </li>
        ))}
      </ul>
    </div>
  );
}
