import React, { Component } from 'react';
import { URL_API } from '../properties';
import axios from 'axios';
import M from 'materialize-css';

import Asistencias from './infoAlumno/asistencias.cmpt';
import PagosCobros from './infoAlumno/pagosCobros.cmpt';
import Adicionales from './infoAlumno/adicionales.cmtp';

import logoSinImagen from '../assets/logoAcademia.jpg';

class InfoAlumno extends Component {

    state = {
        student: false,
        option: 1
    }
    componentDidMount() {

        M.Tabs.init(document.getElementById('optionsStudent'), { swipeable: true });
    }

    changeOption = (event) => {
        let { value } = event.target;
        this.setState({ option: parseInt(value) });
    }


    componentWillMount() {
        let { consecutivo } = this.props.match.params;
        axios.post(`${URL_API}/getStudentByID`, { consecutivo: parseInt(consecutivo) }).then((result) => {
            if (result.data) {
                this.setState({ student: result.data });
            } else {
                this.props.history.push(`/dashboard`);

            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 404) {
                    M.toast({ html: error.response.data.message, classes: "red" });
                } else {
                    M.toast({ html: error.response.data.message, classes: "red" });
                }
            } else {
                M.toast({ html: "No se logro recuperar la información del alumno", classes: "red" });
            }
            this.props.history.push(`/dashboard`);

        });

    }


    render() {
        let { student, option } = this.state;
        console.log(student.image);
        return (
            <div className="container">
                <div className="row mt-1">
                    <div className="col s12 m6 l6 xl6">
                        <div className="card horizontal">
                            <div className="card-image">

                                {
                                    !student.image || student.image === "null" ? 
                                        <img src={logoSinImagen} className="responsive-img" 
                                        alt={student.name} />
                                    : <img src={`${URL_API}/get-image-student/${student.image}`}
                                    className="responsive-img"
                                    alt={student.name} />
                                }
                                
                            </div>
                            <div className="card-content">
                                <h5>{student.name}</h5>
                                <p>ID: {student.consecutivo}</p>
                                <p>Tel:{student.tel}</p>
                                <p>Contacto: {student.emergency}</p>
                                <p>{new Date(parseInt(student.birthday)).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                   
                </div>
                <div className="row">
                        {
                                option === 1 ?
                                    <div id="asistencias" className="col s12">
                                        <Asistencias student={student} />
                                    </div>
                                    : null
                                   
                            }
                            {
                                option === 2 ?
                                <div id="pagosCobrosInfo" className="col s12">
                                <PagosCobros student={student} />
                            </div>
                            : null
                            }
                             {
                                option === 3 ?
                                <div id="adicionalesInfo" className="col s12">
                                <Adicionales student={student} />
                            </div>
                            : null
                            }
                             
                    </div>
            </div>
        )
    }

}
export default InfoAlumno;