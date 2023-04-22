
import React, {useEffect} from "react";
import logo from "./logo.svg";


import "./App.css";
import InterfazBuscarUF from "./vistas/UIBuscarUF";


function App() {
  const [titulo, setTitulo] = React.useState(null);


  useEffect(() => {
    fetch("/titulo")
      .then((res) => res.json())
      .then((titulo) => setTitulo(titulo.mensaje));
  }, []);

  

  return (
    <div className="App">
      <header className="App-header">
        <p>{!titulo ? "Cargando..." : titulo}</p>
      </header>
      <div className="App-subheader">
        <h1>Consulta de valor UF</h1>
      </div>
      <div className="App-body">
        
        <div className="body-interfaz">
          <InterfazBuscarUF/>
                     
        </div>
      </div>
    </div>
  );
}

export default App;