import React from "react";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from "react-accessible-accordion";
import { translations } from "./Utils";

interface ForecastProps {
    forecast: {
        list: {
            weather: {
                description: string;
                icon: string;
            }[];
            main: {
                temp_max: number;
                temp_min: number;
                pressure: string;
                humidity: string;
                sea_level: string;
                feels_like: string;
            };
            wind: {
                speed: string;
            };
            clouds: {
                all: string;
            };
        }[];
    };
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
    const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayInAWeek = new Date().getDay();
    const forecastDays = WEEK_DAYS.slice(dayInAWeek).concat(WEEK_DAYS.slice(0, dayInAWeek));

    return (
        <div className="forecast-horizontal">
            <Accordion className="accordion-horizontal">
                {forecast.list.slice(0, 7).map((item, index) => (
                    <AccordionItem key={index} className="accordion-item">
                        <AccordionItemHeading className="accordion-item-heading">
                            <AccordionItemButton className="accordion-item-button">
                                <div className="daily-item">
                                    <img src={`weather_icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
                                    <label className="day text-white">{forecastDays[index]}</label>
                                    <label className="description text-white">{translations[item.weather[0].description]}</label>
                                    <label className="min-max text-white">{Math.round(item.main.temp_max)}°C / {Math.round(item.main.temp_min)}°C</label>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className="accordion-item-panel">
                            <div className="daily-details-grid">
                                <div className="daily-details-grid-item">
                                    <label>Presión:</label>
                                    <label>{item.main.pressure}</label>
                                </div>
                                <div className="daily-details-grid-item">
                                    <label>Humedad:</label>
                                    <label>{item.main.humidity}%</label>
                                </div>
                                <div className="daily-details-grid-item">
                                    <label>Nubes:</label>
                                    <label>{item.clouds.all}%</label>
                                </div>
                                <div className="daily-details-grid-item">
                                    <label>Velocidad del viento:</label>
                                    <label>{item.wind.speed} m/s</label>
                                </div>
                                <div className="daily-details-grid-item">
                                    <label>Nivel del mar:</label>
                                    <label>{item.main.sea_level}m</label>
                                </div>
                                <div className="daily-details-grid-item">
                                    <label>Sensación:</label>
                                    <label>{item.main.feels_like}°C</label>
                                </div>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};


    
