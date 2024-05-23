import { useState } from "react";

export const Units = () => {

    const rates = {
        feet: 0.3048,
        miles: 1.60934,
        lbs: 0.453592,
        yards: 0.9144,
        galons: 3.78541,
        kw: 1.34102
    }
    const [amount, setAmount] = useState();
    const [selectedUnit, setSelectedUnit] = useState('');
    const [convertedAmount, setConvertedAmount]=useState('');
    const handleChangeInput = (event:any) => {
        setAmount(event.target.value);
    }

    const handleChangeRadio = (event:any) => {
    setSelectedUnit(event.target.value);
    }

    const handleConversion = () => {
        switch (selectedUnit) {
            case 'kW': const hp = Number(amount)*Number(rates.kw); setConvertedAmount(hp.toFixed().toString() +'HP'); break; 
            case 'lbs':const kg = Number(amount)*Number(rates.lbs); setConvertedAmount(kg.toFixed(2).toString() +'KG'); break;  
            case 'gl': const liters = Number(amount)*Number(rates.galons); setConvertedAmount(liters.toFixed(2).toString() +'litros'); break;  
            case 'Miles': const km = Number(amount)*Number(rates.miles); setConvertedAmount(km.toString() +"km"); break;
            case 'Yards': const meters = Number(amount)*Number(rates.yards); setConvertedAmount(meters.toFixed(2).toString() +"metros"); break; 
            case 'Feet': const heightMeters = Number(amount)*Number(rates.feet); setConvertedAmount(heightMeters.toFixed(2).toString() +"metro(s)"); break; 
        } 
    }

    return (

        <div className="form-check">
           
            <input type="radio" className="form-check-input" onChange={handleChangeRadio} name="units" id="kW" value="kW" />
            <label htmlFor="kW">Kilovatios</label>
            
            <input type="radio" className="form-check-input" onChange={handleChangeRadio} name="units" id="lbs" value="lbs" />
            <label htmlFor="lbs">Libras</label>

          
            <input type="radio" className="form-check-input" onChange={handleChangeRadio} name="units" id="ft" value="Feet" />
            <label htmlFor="ft">Pies</label>

           
            <input type="radio" className="form-check-input" onChange={handleChangeRadio} name="units" id="gl" value="gl" />
            <label htmlFor="gl">Galones</label>

           
            <input type="radio" className="form-check-input" onChange={handleChangeRadio} id="Millas" name="units" value="Miles" />
            <label htmlFor="Millas">Millas</label>

        
            <input type="radio" className="form-check-input " onChange={handleChangeRadio} id="yardas" name="units" value="Yards" />
            <label htmlFor="yardas">Yardas</label>

            <input type="number" className="form-text mt-3 w-100" placeholder="Introduce la cantidad" onChange={handleChangeInput}></input>
            <p className="display-4 leading">{convertedAmount !== '' ? convertedAmount : ''}</p>
            <button className="btn btn-primary" onClick={handleConversion}>Convertir</button>
        </div>
    );
}