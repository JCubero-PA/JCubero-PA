import React, { useEffect } from "react";
import ProductosPaloList from "../../productos/productoList/visualizadores/palo/_productosPaloList";

const _ProductosPalo = () => {
    return (
      <>
        <ProductosPaloList
          visualizador={true}
        />
      </>
    );
};

export default _ProductosPalo;