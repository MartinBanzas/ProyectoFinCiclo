export const translations: Record<string, string> = {
  "clear sky": "Despejado",
  "broken clouds": "Nubes ocasionales",
  "light rain": "Lluvia ligera",
  "thunderstorm": "Tormenta eléctrica",
  "snow": "Nieve",
  "mist": "Niebla",
  "drizzle": "Orballo",
  "overcast clouds": "Nubes",
  "shower rain": "Lluvia torrencial",
  "few clouds": "Pocas nubes",
  "scattered clouds": "Nubes dispersas",
  "light intensity drizzle":"Llovizna"
 
};

const apiKey = "5d22dee67f1f6a4a8092cad66ab624d4";
const url = "https://api.openweathermap.org/data/2.5/";
const units="&units=metric";

export const fetchClimateData = async (city: String, country: String) => {

  const fetchCurrentWeather = `${url}weather?q=${city},${country}&APPID=${apiKey}&units=metric`;
  const fetchForecast = `${url}forecast?q=${city},${country}&APPID=${apiKey}&units=metric`;
  try {
    const currentResponse = await fetch(fetchCurrentWeather);
    const forecastResponse = await fetch(fetchForecast);
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Algo ha ido mal");
    }

    const currentWeatherJson = await currentResponse.json();
    const forecastJson = await forecastResponse.json();
    // console.log(currentWeatherJson);
    console.log(forecastJson);
    return { currentWeatherJson, forecastJson };
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
};

export const fetchClimateDataFromCoordinates = async (latitude:string, longitude:string) => {

  const fetchCurrentWeather = `${url}weather?lat=${latitude}&lon=${longitude}&APPID=${apiKey}${units}`;
  const fetchForecast = `${url}forecast?lat=${latitude}&lon=${longitude}&APPID=${apiKey}${units}`;

  try {
    const currentResponse = await fetch(fetchCurrentWeather);
    const forecastResponse = await fetch(fetchForecast);
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Algo ha ido mal");
    }

    const currentWeatherJson = await currentResponse.json();
    const forecastJson = await forecastResponse.json();
     console.log(currentWeatherJson);
    console.log(forecastJson);
    return { currentWeatherJson, forecastJson };
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
 
}

