import React, { Component } from 'react';
import { URL_API } from '../properties';

import logoSinImagen from '../assets/logoAcademia.jpg';

class DetailStudent extends Component {

    render() {
        let { student,complete } = this.props;
        return (
            <div className={`${complete ? "col s12" : "col s12 m6 l6 xl6"}`}>
                <div className="row center-align">
                    <div className="card horizontal">
                        <div className="card-image">
                            {
                                !student.image || student.image === "null" ? 
                                <img src={logoSinImagen} className="responsive-img" alt={student.name} />
                                :    <img src={`${URL_API}/get-image-student/${student.image}`} className="responsive-img" 
                                alt={student.name}
                            />
                            }
                           
                        </div>
                        <div className="card-stacked">
                            <div className="card-content left-align">
                                <p><strong>{student.name}</strong></p>
                                <p>ID: {student.consecutivo}</p>
                                <p>Tel: {student.tel}</p>
                                <p>Contacto: {student.emergency}</p>
                                <p>Observaciones: {student.observations}</p>
                                <p>Forma de Pago: 
                                        {
                                        student.methodPayment === 1 ? 
                                        " Mensual" : 
                                        student.methodPayment === 2 ?
                                        " Semanal " : " Por Clase"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default DetailStudent;