import React,{useState,useEffect} from 'react'
import './styles.module.css'

export const ShMoneyInput=({
        customClassName="",
        defaultValue=0,
        label="",
        currency='',
        convertCurrency='',
        convertCurrencyShow=true,
        currencyPosision='',
        setpValue=1000,
        min=0,
        max=10000000000000000000,
        showUpDownArrow=true,
        theme=''
    })=>{
        const [value, setValue] = useState(defaultValue);
        const [numberValue, setNumberValue] = useState('');
        const [formatedValue, setFormatedValue] = useState('');
        const [formatedValueWithCurrency, setNumberValueWithCurrency] = useState('');

        useEffect( ()=>{
            setValue(format(defaultValue));
            setNumberValue(defaultValue);
            setFormatedValue(format(defaultValue));
            if(currencyPosision===''){
                currencyPosision=ShMoneyInput.currencyPosisionEnum.IN_INPUT;
            }
            if(currency==''){
                currency=ShMoneyInput.currencyEnum.RIAL;
            }
            if(convertCurrency==''){
                convertCurrency=ShMoneyInput.currencyEnum.TOMAN;
            }
            if(theme==''){
                theme=ShMoneyInput.theme.DEFALT;
            }
         },[]);

        function format(value){
            value=value.toString().replace(/\D/g,'').replace(/^0+/,'');
            if(value==''){value=0;}
            if(convertCurrencyShow){
                if(convertCurrency==ShMoneyInput.currencyEnum.TOMAN && currency==ShMoneyInput.currencyEnum.RIAL){
                    setNumberValueWithCurrency((value/10).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + convertCurrency)
                }else if(convertCurrency==ShMoneyInput.currencyEnum.RIAL && currency==ShMoneyInput.currencyEnum.TOMAN){
                    setNumberValueWithCurrency((value*10).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + convertCurrency)
                }else{
                    setNumberValueWithCurrency(value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + currency)
                }
            }else{
                setNumberValueWithCurrency(value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + currency)
            }
            
            if(currencyPosision==ShMoneyInput.currencyPosisionEnum.IN_INPUT){
                return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " " + currency;
            }else{
                return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
            
        }

        function getPureNumber(){
            let v=value.toString().replace(/\D/g,'').replace(/^0+/,'');
            if(v==''){v=0;}
            return v;
        }

        function onChange(value){
            setValue(format(value));
            setNumberValue(value);
            setFormatedValue(format(value));
        }
        
        function onFocus(){
            let value=formatedValue;
            setValue(value);
        }

        function onFocusOut(){
            let value=formatedValue;
            setValue(value);

            if(getPureNumber()>max){
                setValue(format(max));
                setNumberValue(max);
                setFormatedValue(format(max));
            }else if(getPureNumber()<min){
                setValue(format(min));
                setNumberValue(min);
                setFormatedValue(format(min));
            }
        }

        const onKeyDown = (event) => {
            if(event.keyCode == 38){
                up();
            }else if(event.keyCode == 40){
                down();
            }else if(event.keyCode == 8){
                if(currencyPosision===ShMoneyInput.currencyPosisionEnum.IN_INPUT){
                    let v=getPureNumber().toString().slice(0, -1);                
                    setValue(format(v));
                    setNumberValue(v);
                    setFormatedValue(format(v));
                }
            }
            console.log(event.keyCode);
        }

        const onWheel = (event) => {
            console.log("onWheel: ", event);
            if (event.deltaY < 0)
            {
                up();
            }
            else if (event.deltaY > 0)
            {
                down();
            }
        }

        function up(){
            if(getPureNumber()<max){
                let v=parseFloat(getPureNumber())+parseFloat(setpValue);
                setValue(format(v));
                setNumberValue(v);
                setFormatedValue(format(v));
            }
        }

        function down(){
            if(getPureNumber()>=setpValue && getPureNumber()>min){
                let v=parseFloat(getPureNumber())-parseFloat(setpValue);
                setValue(format(v));
                setNumberValue(v);
                setFormatedValue(format(v));
            }
        }

        
        return(
            <div className={customClassName + " shMoney"}>
                <label>{label} :</label>
                <div className="shMoney-input">
                    {showUpDownArrow?(
                        <div className="shMoney-arrow">
                            <a onClick={up}>▲</a>
                            <a onClick={down}>▼</a>
                        </div>
                    ):("")}    
                    <input 
                        type="text" 
                        value={value} 
                        onChange={e => onChange(e.target.value.replace(/\D/g,''))}
                        onFocus={onFocus}
                        onFocusOut={onFocusOut}
                        onBlur={onFocusOut}
                        onKeyDown={onKeyDown}
                        onWheel={onWheel}
                        />
                    {currencyPosision==ShMoneyInput.currencyPosisionEnum.OUT_INPUT?(
                        <span className="currency-label">{currency}</span>
                    ):("")}
                </div>
                {convertCurrencyShow?(
                    <span>{formatedValueWithCurrency}</span>
                ):("")}
            </div>
        );
}

ShMoneyInput.currencyPosisionEnum={
    "IN_INPUT":"IN_INPUT",
    "OUT_INPUT":"OUT_INPUT",
    "HIDE":"HIDE"
}

ShMoneyInput.currencyEnum={
    "TOMAN":"تومان",
    "RIAL":"ریال"
}

ShMoneyInput.theme={
    "DEFALT":"DEFALT"
}