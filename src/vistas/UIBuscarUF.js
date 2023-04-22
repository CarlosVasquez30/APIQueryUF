import {useState, useRef} from "react";
import "./UIBuscarUF.css";




export default function InterfazBuscarUF() {


    const [tarjetasUF , setTarjetasUF] = useState([]);
    const [inputVacio , setInputVacio] = useState(true);
    const [day , setDay] = useState('');
    const [month , setMonth] = useState('');
    const [year , setYear] = useState('');
    const [infoFormText , setInfoFormText] = useState('Buscar valor de unidad de fomento por fecha 💸');
    const [fechasConsultadas, setFechasConsultadas] = useState([]);


    function convertirNumeroAMes(numero){
        let meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        return meses[numero-1];
    }
    
    
                

    function cardUF(id,uf,fecha){
        return(<div className="card-UF">
        <div className="info-card">
        <a>El valor UF al dia {fecha.split('-')[0]+' de '+convertirNumeroAMes(fecha.split('-')[1])+' del año '+fecha.split('-')[2]} es</a>
        <a style={
            {
                fontSize: '40px',
                fontWeight: 'bold',
            }
        }>${uf}</a>
        </div>
        
    </div>);}

    async function buscarUF(){
        if (fechasConsultadas.includes(day+'-'+month+'-'+year)){
            setInfoFormText('Ya se ha consultado el valor de la UF para esta fecha ❌');
            //luego de 3 segundos volver al mensaje inicial
            setTimeout(() => {
                setInfoFormText('Buscar valor de unidad de fomento por fecha 💸');
            }, 5000);
            
            return;
        }
        await fetch('/uf/'+day+'-'+month+'-'+year)
        .then(res => res.json())
        .then(data => {
            console.log(data.status);
            if (data.status === 'ERROR'){
                setInfoFormText(data.mensaje+' ❌');
                //luego de 3 segundos volver al mensaje inicial
                setTimeout(() => {
                    setInfoFormText('Buscar valor de unidad de fomento por fecha 💸');
                }, 5000);
                
                return;
            }
            setInfoFormText('Buscar valor de unidad de fomento por fecha 💸')
            
            console.log(data.mensaje.fecha);
            console.log(fechasConsultadas)
           console.log(tarjetasUF.length);
           var maxTarjetas = 0;
           if (calcPantalla('width') > 768){
                maxTarjetas = 6;
            }else{
                maxTarjetas = 3;
            }
                if (tarjetasUF.length < maxTarjetas){
                    setFechasConsultadas([...fechasConsultadas,data.mensaje.fecha]);
                setTarjetasUF([...tarjetasUF,cardUF(tarjetasUF.length,data.mensaje.UF,data.mensaje.fecha)]);
                }else{
                    //borrar todos los datos de tarjetasUF y fechasConsultadas
                    setTarjetasUF([]);
                    setFechasConsultadas([]);
                }
   
            }
        );
    }

    function dispararConsulta(){
        buscarUF().then(() => {
            setTimeout(() => {
                console.log(fechasConsultadas);
            }, 0);
        });
    }

    const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    
    ];

    function handleInputChange(e, index) {
        const input = e.target;
        if (input.value.length >= input.maxLength && index < inputRefs.length - 1) {
           inputRefs[index + 1].current.focus();
        }
    }

    function calcPantalla(side){
        if (side === 'width'){
            console.log(window.innerWidth);
            return window.innerWidth;
        }
        else if (side === 'height'){
            return window.innerHeight;
        }
    }

    return (
        <div className="App-Buscar-UF">
            
            <a>{infoFormText}</a>
            <div style={{marginTop: '5vh',marginBottom: '3vh',padding: '10px'}}>
                <input className="input-search-uf" placeholder="00" maxLength={2} 
                    ref={inputRefs[0]} onChange={
                                                (e) => 
                                                    {
                                                        handleInputChange(e, 0);
                                                        setDay(e.target.value);
                                                    }}></input>
                <input className="input-search-uf" placeholder="00" maxLength={2} 
                    ref={inputRefs[1]} onChange={
                                                (e) => 
                                                    {
                                                        handleInputChange(e, 1);
                                                        setMonth(e.target.value);
                                                    }}></input>
                <input className="input-search-uf" placeholder="00" maxLength={2} 
                    ref={inputRefs[2]} onChange={(e) => setYear('20'+e.target.value)}></input>
            </div>
            {year === "" ? null : <button onClick={dispararConsulta} className="btn-search-uf">Generar consulta en SII</button>}
            <div className="tarjetas-UF">{tarjetasUF}</div>
        </div>
    );
}