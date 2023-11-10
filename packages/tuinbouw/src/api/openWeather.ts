const apiKey = import.meta.env.VITE_OPENWEATHER_apiKey;

export const getForecast = async (city: string): Promise<any> => {
    console.log('getForecast', city);
    console.log('apiKey', apiKey);
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    return data;
}