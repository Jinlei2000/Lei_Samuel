import type { Forecast } from "@/interfaces/forecast.interface";

const apiKey = import.meta.env.VITE_OPENWEATHER_apiKey;

export const getForecast = async (city: string): Promise<Forecast> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    return data;
}

export const getForecastForWeek = async (city: string): Promise<any> => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    const forecast = data.list;
    const week: any[][] = [];
    let currentDay = 0;
    let day: any[] = [];
    forecast.forEach((item: any) => {
        const date = new Date(item.dt_txt);
        const dayOfWeek = date.getDay();
        const time = date.getHours();
        if (time === 12) {
            week.push(item);
        }
    });
    console.log(week)
    return week;
}