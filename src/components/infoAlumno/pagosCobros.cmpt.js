import React, { Component } from 'react';
import { URL_API } from '../../properties';
import axios from 'axios';
import M from 'materialize-css';
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];

class PagosCobros extends Component {


    state = {
        from: "",
        to: "",
        pagosCobros: []
    }

    changeValues = (event) => {
        let { id, value } = event.target;

        console.log(value);
        this.setState({ [id]: value }, () => {
            this.getPagosCobros();
        });


    }


    getPagosCobros = () => {

        let { from, to } = this.state;
        let { student } = this.props;

        if (from.trim() !== "" && to.trim() !== "") {

            let data = {
                "id": student._id,
                "from": from,
                "to": to
            }
            console.log(data);
            console.log(JSON.stringify(data));

            axios.post(`${URL_API}/getPaymentsChargesByStudent`, data).then((res) => {
           
                console.log(res.data.length);
                console.log(res.data)
                this.setState({ pagosCobros: res.data });
            }).catch((error) => {
                if (error.response) {
                    M.toast({ html: error.response.data.message, classes: "red" });
                }
            })
        }


    }

    render() {
        let { from, to, pagosCobros } = this.state;
        return (
            <div className="row z-depth-2 mt-1">
                <div className="input-field col s6">
                    <input id="from" type="date" value={from}
                        onChange={this.changeValues}
                    />
                    <label htmlFor="from">Desde:</label>
                </div>
                <div className="input-field col s6">
                    <input id="to" type="date" value={to}
                        onChange={this.changeValues}
                    />
                    <label htmlFor="to">Hasta:</label>
                </div>
                <div className="col s12">
                    {
                        pagosCobros.length ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Cargo</th>
                                        <th>Abono</th>
                                        <th>Concepto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pagosCobros.map((value, index) => {
                                          
                                            console.log(value.concept);
                                            let f = new Date(value.date);
                                            let format = dias[f.getDay()] + " " + f.getDate() + " de " + meses[f.getMonth()] + " del " + f.getFullYear() + " ";//+ f.getHours() + ":" + f.getMinutes();
                                            return (<tr key={index}>
                                                <td>{format}</td>
                                                <th>{value.charge ? `$${parseFloat(Math.round(value.charge * 100) / 100).toFixed(2)}` : ""}</th>
                                                <th>{value.payment ? `$${parseFloat(Math.round(value.payment * 100) / 100).toFixed(2)}` : ""}</th>
                                                <th>{value.concept? value.concept.concept:
                                                    !value.concept && value.payment ? "Abono Clase" : "Clase"
                                                }</th>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                            : null
                    }

                </div>

            </div>
        )
    }

}

export default PagosCobros;