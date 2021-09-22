import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { LineaMarcaService } from "../../services/lineaMarcaService";
import { MedidaService } from "../../services/medidaService";
import { paises } from "../../utils/paises";
import { LineaService } from "../../services/lineaService";
import { MarcaService } from "../../services/marcaService";
import { GrupoService } from "../../services/grupoService";
import { GrupoMarcaService } from "../../services/grupoMarcaService";
import { SubgrupoService } from "../../services/subgrupoService";
import { ProveedorMarcaService } from "../../services/proveedorMarcaService";
import { ColorGrupoService } from "../../services/colorGrupoService";
import { resistenciasAbrasion } from "../../utils/resistenciasAbrasion";
import { sistemasClick } from "../../utils/sistemasClick";
import { clasesIndustrial } from "../../utils/clasesIndustrial";
import { clasesComercial } from "../../utils/clasesComercial";
import { clasesResidencial } from "../../utils/clasesResidencial";
import { core } from "../../utils/core";
import { terminado } from "../../utils/terminado";
import { garantias } from "../../utils/garantias";
import { materialesSubcapa } from "../../utils/materialesSubcapa";
import { coloresSubcapa } from "../../utils/coloresSubcapa";
import { formatos } from "../../utils/formatos";
import { tonos } from "../../utils/tonos";
import { capacidadesRodamientoCarga } from "../../utils/capacidadesRodamientoCarga";
import { coloresPegamentos } from "../../utils/coloresPegamentos";
import { oloresPegamentos } from "../../utils/oloresPegamentos";
import { adherenciasPegamentos } from "../../utils/adherenciasPegamentos";
import { resistenciasDeslizamiento } from "../../utils/resistenciasDeslizamiento";
import { resistenciasAbrasionPorcelanato } from "../../utils/resistenciasAbrasionPorcelanato";
import { ProductoTipoService } from "../../services/productoTipoService";
import { ProductoService } from "../../services/productoService";

const { Option } = Select;
const SelectOpciones = (props) => {
  
  // Recibiendo parametros como props por desestructuración
  const { tipo, onChange, value, filter, filter2, filter3, readOnly, setShow, typeTransaction } =
    props;

  // State para opciones
  const [opciones, setOpciones] = useState([]);

 // console.log("MIS PROPS",props);

  // UseEffect para el control de todos los dropdowns de opciones

  useEffect(() => {
    let cancel = false;

    async function fetch() {
      // console.log(" tipo . "+tipo)
      if (tipo === "línea") {
        const lineaService = new LineaService();
        lineaService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(data);
        });
      } else if(tipo === "grupos") {
        const grupoService = new GrupoService();
        const grupoMarcaService = new GrupoMarcaService();
        // console.log("FILTER-MARCA", filter);
        // console.log("FILTER-LINEA", filter2);
        if (typeTransaction){
          if (typeTransaction.hasFilter){
            // console.log("VA A COMPARAR CON ESTE FILTER2: " + filter2)
            if (filter2 === "60d4c04b894c18b5e810e025"){
              // console.log("ENTRA AL MATERIAL DE MARKETING FILTER2")
              if (filter && filter2){

                grupoMarcaService.getAll().then((data) => {
                  if (cancel) return;
                  setOpciones(data.filter((p) => p.marca_id === filter && p.linea_id === filter2));
                });
              } else {}
            } else {
                if (filter2){ 
                  grupoService.getAll().then((data) => {
                    if (cancel) return;
                    setOpciones(data);
                  });
                } else {
                  grupoMarcaService.getAll().then((data) => {
                    if (cancel) return;
                    setOpciones(data);
                  });
                }
            }
          } else {
            grupoService.getAll().then((data) => {
              if (cancel) return;
              setOpciones(data);
            });
          }
        } else { }
        
      } else if (tipo === "marcas") {
        const marcaService = new MarcaService();
        const lineaMarcaService = new LineaMarcaService();

        if (typeTransaction){
          if (typeTransaction.hasFilter){
            lineaMarcaService.getAll().then((data) => {
            if (cancel) return;
            setOpciones(data.filter((p) => p.linea_id === filter));
          });
          } else {
            
            marcaService.getAll().then((data) => {
              if (cancel) return;
              setOpciones(data);
            });
          }
        } else {
          marcaService.getAll().then((data) => {
            if (cancel) return;
            setOpciones(data);
          });
        }
      } else if (tipo === "marca" && filter) {
        const lineaMarcaService = new LineaMarcaService();
        lineaMarcaService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(data.filter((p) => p.linea_id === filter));
        });
      } else if (tipo === "grupo" && filter && filter2) {
        console.log("FILTER-MARCA", filter);
        console.log("FILTER-LINEA", filter2);

        const grupoService = new GrupoMarcaService();
        grupoService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(
            data.filter((p) => p.marca_id === filter && p.linea_id === filter2)
          );
        });
      } else if (tipo === "modelo" && filter) {
        console.log("FILTER-COLOR:", filter);
        console.log("FILTER-COLOR2:", filter2);

        const productoService = new ProductoService()
        await productoService.getModelos().then((data) => {
            if (cancel) return;
            console.log("modelos", data)
              setOpciones(
                data);
          });
        // const colorService = new ColorGrupoService();
        // await colorService.getAll().then((data) => {
        //   if (cancel) return;
        //   if (filter3 === "60d4c04b894c18b5e810e025") {
        //     setOpciones(
        //       data.filter(
        //         (p) => p.grupo_id === filter && p.marca_id === filter2
        //       )
        //     );
        //   } else {
        //     setOpciones(data.filter((p) => p.grupo_id === filter));
        //   }
        // });
        setShow(false);
      } else if (tipo === "proveedor" && filter) {
        console.log("ejecuta proveedor");
        const proveedorService = new ProveedorMarcaService();
        proveedorService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(data.filter((p) => p.marca_id === filter));
        });
      } else if (tipo === "unidad de medida" || tipo === "unidad de venta") {
        const medidaService = new MedidaService();
        if (tipo === "unidad de medida") {
          medidaService.getAll().then((data) => {
            if (cancel) return;
            setOpciones(
              data.filter((p) => p.tipo_unidad.toUpperCase() === "MEDIDA")
            );
          });
        } else {
          medidaService.getAll().then((data) => {
            if (cancel) return;
            setOpciones(
              data.filter((p) => p.tipo_unidad.toUpperCase() === "VENTA")
            );
          });
          // setShow(false);
        }
      }else if(tipo === "tipo"){ 
        const productoTipoService = new ProductoTipoService();
        productoTipoService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(data);
        });
      }else if (tipo === "procedencia") {
        setOpciones(paises);
      } else if (tipo === "resistencia a la abrasion") {
        setOpciones(resistenciasAbrasion);
      } else if (tipo === "sistema de click") {
        setOpciones(sistemasClick);
      } else if (tipo === "clase residencial") {
        setOpciones(clasesResidencial);
      } else if (tipo === "clase comercial") {
        setOpciones(clasesComercial);
      } else if (tipo === "clase industrial") {
        setOpciones(clasesIndustrial);
      } else if (tipo === "core") {
        setOpciones(core);
      } else if (tipo === "terminado") {
        setOpciones(terminado);
      } else if (tipo === "garantía") {
        setOpciones(garantias);
      } else if (tipo === "material") {
        setOpciones(materialesSubcapa);
      } else if (tipo === "color de subcapa") {
        setOpciones(coloresSubcapa);
      } else if (tipo === "formato") {
        setOpciones(formatos);
      } else if (tipo === "tono") {
        setOpciones(tonos);
      } else if (tipo === "capacidad de rodamiento de carga") {
        setOpciones(capacidadesRodamientoCarga);
      } else if (tipo === "color de pegamento") {
        setOpciones(coloresPegamentos);
      } else if (tipo === "olor") {
        setOpciones(oloresPegamentos);
      } else if (tipo === "adherencia") {
        setOpciones(adherenciasPegamentos);
      } else if (tipo === "resistencia al deslizamiento") {
        setOpciones(resistenciasDeslizamiento);
      } else if (tipo === "resistencia a la abrasión") {
        setOpciones(resistenciasAbrasionPorcelanato);
      } else if (tipo === "subgrupo") {
        const subgrupoService = new SubgrupoService();
        subgrupoService.getAll().then((data) => {
          if (cancel) return;
          setOpciones(data);
        });
      }
      else {
        setOpciones([]);
      }
    }

    fetch();
    return () => {
      cancel = true;
    };
  }, [filter]);

  // Funcion para manejar cambios
  function handleChange(value) {
    // console.log("VALORES CON LABEL",value);
      onChange(value);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  // Objeto para renderización de opciones del dropdown

  var opcionesList = opciones.map(function (opcion) {
    if (opcion.codigo) {
      return (
        <Option key={opcion.id} value={opcion.id}>
          {opcion.nombre.toUpperCase()}
        </Option>
      );
    } else {
      return (
        <Option key={opcion.id} value={opcion.id}>
          {opcion.nombre.toUpperCase()}
        </Option>
      );
    }
  });

  const strForSearch = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : str;
  };

  return (
    <Select
    //placeholder={"HOLA MUNDO"}
      labelInValue={tipo ==="tipo" ? true : false}
      showSearch
      disabled={readOnly}
      mode={typeTransaction ? typeTransaction.mode :null}
     // mode="-"
      style={typeTransaction ? typeTransaction.mode === "multiple" ? { width: 1100 } : { width: 200 }  : { width: 250 }}
      //
      placeholder={ typeTransaction ? "Seleccione " + typeTransaction.placeHoldertext : "Seleccione " + tipo}
     // placeholder={ typeTransaction ? typeTransaction.placeHoldertext ?"Seleccione " + typeTransaction.placeHoldertext : "Seleccione " + tipo : "null" }
    
      optionFilterProp="children"
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      value={opcionesList.length > 0 ? value : null}
      onSearch={onSearch}
      notFoundContent="No hay coincidencias"
      filterOption={(input, option) => {
        if (option.props.value) {
          return strForSearch(option.props.children).includes(
            strForSearch(input)
          );
        } else {
          return false;
        }
      }}
    >
      {opcionesList}
    </Select>
  );
};

export default SelectOpciones;
