import React, { Component } from 'react';
import { URL_API } from '../properties';
import M from 'materialize-css';
import axios from 'axios';
import ReactToPrint from 'react-to-print';

class ComponentToPrint extends Component {

    state={
        totalDebtLessonsFormat: ""
    }

    getTotalDebt() {
        axios.post(`${URL_API}/getTotalDebtLessons`, { id: this.props.student._id }).then((result) => {
            if (result.data) {
                if(result.data.totalDebt > 0){
                    this.setState({
                        totalDebtLessonsFormat: `$${parseFloat(Math.round(result.data.totalDebt * 100) / 100).toFixed(2)}`
                    })
                }
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.getTotalDebt();
    }

    plantillaFecha(fecha) {
        let date = fecha;
        if (typeof fecha === "string") {

            if (fecha.trim() !== "") {
                try {
                    date = new Date(fecha);
                } catch (error) {
                    return "";
                }

            } else {
                return "";
            }

        }

        let mes = date.getMonth();
        //let dia = date.getDate();
        let dia = date.getDate();
        let anio = date.getFullYear();

        var weekday = new Array(7);
        weekday[0] = "Lunes";
        weekday[1] = "Martes";
        weekday[2] = "Miercoles";
        weekday[3] = "Jueves";
        weekday[4] = "Viernes";
        weekday[5] = "Sabado";
        weekday[6] = "Domingo";

        var month = new Array(12);
        month[0] = "Ene";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Abr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Ago";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dic";



        //return weekday[diaSemana] + " "+dia + " de " +month[mes] + " del " + anio;
        return dia + "/" + month[mes] + "/" + anio;

    }


    getTotalExtras() {
        let extras = this.props.extras;
        let totalDebtExtras = 0;
        extras.forEach((value, index) => {
            if (!value.finished && !value.canceled) {
                if (value.remaining) {
                    totalDebtExtras += value.remaining;
                } else {
                    totalDebtExtras += value.amount;
                }
            }

        })

        return totalDebtExtras;
    }

    getTotalPagos() {
        let totalPagos = 0;

        if (this.props.data.pagosRealizados.length) {
            this.props.data.pagosRealizados.forEach((value, index) => {
                totalPagos += parseFloat(value.montoAbono);
            });
        }

        return totalPagos;
    }

    render() {
        return (
            <div className="container contentTicket" style={{ marginBottom: "30px" }}>
                <div className="row ticket">
                    <div className="col s12 left-align">
                        <p>Academia Gladiadores</p>
                        <p>Dirección: Calle Heroes de Tlapacoyan 315</p>
                        <p>Tel: 225 101 8148</p>
                        <p>Fecha:{this.plantillaFecha(new Date())}</p>
                        <p>=================================</p>
                    </div>
                </div>
                <div className="row ticket">
                    <div className="col s12 left-align">
                        <p>{this.props.student.name}</p>
                        <p>ID: {this.props.student.consecutivo}</p>
                        <p>=================================</p>
                    </div>
                </div>
                <div className="row ticket">
                    <div className="col s12 left-align">
                        {
                            this.props.data.pagosRealizados.map((value, index) => {
                                return (<p key={index}>{value.textoExtra} --- ${parseFloat(Math.round(value.montoAbono * 100) / 100).toFixed(2)}</p>)
                            })
                        }
                        <p>=================================</p>
                    </div>
                </div>
                <div className="row ticket">
                    <div className="col s12 left-align">
                        <p>Total ----- ${parseFloat(Math.round(((this.getTotalPagos())) * 100) / 100).toFixed(2)}</p>
                        <p>=================================</p>
                    </div>
                </div>
                {
                    this.getTotalExtras() > 0 ?
                        <div className="row ticket">
                            <div className="col s12 left-align">

                                <p>Adicionales por Pagar ----  ${parseFloat(Math.round(this.getTotalExtras() * 100) / 100).toFixed(2)} </p>
                                <p>=================================</p>
                            </div>
                        </div>
                        : null
                }

                {
                    this.state.totalDebtLessonsFormat !== ""  ?
                    <div className="row ticket">
                            <div className="col s12 left-align">

                                <p>Deuda Clases ---- {this.state.totalDebtLessonsFormat} </p>
                                <p>=================================</p>
                            </div>
                        </div>
                        : null
                }

                <div className="row ticket">
                    <div className="col s12 left-align">
                        <p>*Este ticket es personal y solo información de tus pagos</p>
                        <p>*En caso de que el alumno exceda su limite de pago, nos veremos en la penosa necesidad
de suspender tus clases.</p>
                        <p>*Por tu comprensión gracias.!!!</p>
                        <p>**IMPORTANTE: Este ticket no tiene valor fiscal.**</p>
                    </div>
                </div>
            </div>

        );
    }
}

class AbonoForm extends Component {

    state = {
        extraId: "",
        id: "",
        montoAbono: "",
        abonoExtra: true,
        errors: {},
        extras: [],
        abonoFormo: false,
        month: false,
        years: [],
        year: false,
        pagosRealizados: [],
        printTicket: false
    }

    componentDidMount() {
        var elems = document.getElementById('abonoModal');
        var abonoForm = M.Modal.init(elems, { dismissible: true });
        let currentDate = new Date();
        let years = [];
        years.push(currentDate.getFullYear() - 1);
        years.push(currentDate.getFullYear());
        this.setState({ abonoForm, years }, () => {
            if (this.props.student) {
                this.setState({ id: this.props.student._id }, () => {
                    this.getExtras(this.props.student._id);
                });
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.student || nextProps.reload) {
            this.setState({ id: nextProps.student._id }, () => {
                this.getExtras(this.state.id);
            })
        }
    }


    getExtras = (id) => {

        axios.post(`${URL_API}/getExtras`, { id }).then((response) => {
            if (response.data.length) {
                debugger;
                this.setState({ extras: response.data }, () => {
                    if (this.state.abonoExtra) {
                        M.FormSelect.init(document.querySelectorAll('select'), {
                        });
                    }
                });
            }
        });
    }

    changeValue = (event) => {
        let { id, value } = event.target;
        let { errors } = this.state;
        errors[id] = null;
        this.setState({ [id]: value, errors });
    }

    submitAbono = (event) => {
        event.preventDefault();
        let { montoAbono, errors, abonoExtra, extraId, id, abonoMensualidad, month, year, extras } = this.state;
        let valido = true;
        if (isNaN(montoAbono) || montoAbono.toString().trim() === "") {
            valido = false;
            errors.montoAbono = "Debe ingresar un monto válido.";
        }
        debugger;
        if (abonoExtra && extraId.trim() === "") {
            valido = false;
            errors.extraId = "Elija un concepto a abonar";
        }

        if (abonoMensualidad) {
            if (!month || month.trim() === "") {
                valido = false;
                errors.month = "Elija el mes para aplicar la mensualidad.";
            }
            if (!year || year.trim() === "") {
                valido = false;
                errors.year = "Elija el año para aplicar la mensualidad.";
            }
        }

        if (valido) {
            let data = {
                "id": id,
                "monto": parseFloat(montoAbono),
                "abonoExtra": abonoExtra,
                "extraId": extraId
            }
            if (abonoMensualidad) {

                data.isMonthly = true;
                data.month = month;
                data.year = year;

            }
            let textoExtra = "";
            extras.forEach((value, index) => {
                if (value._id === extraId) {
                    textoExtra = value.concept;
                }
            });
            axios.post(`${URL_API}/addPayment`, data).then((response) => {

                if (response.data) {
                    let pagosRealizados = this.state.pagosRealizados;
                    pagosRealizados.push({
                        montoAbono, textoExtra
                    })
                    M.toast({ html: `${response.data.message}<i class="material-icons">check</i>`, classes: "green" })
                    this.setState({ montoAbono: "", extraId: "", pagosRealizados, printTicket: true }, () => {
                        this.getExtras(id);
                        this.props.reloadExtras();

                    });
                }

            }).catch((error) => {
                console.log(error);
                if (error.response) {
                    debugger;
                    M.toast({ html: "Ocurrio algo", classes: "red" });
                } else {
                    M.toast({ html: "Ocurrio un error inesperado.", classes: "red" });
                }

            });
        } else {
            this.setState({ errors });
        }
    }


    toPay = (event) => {
        let { value } = event.target;
        let abonoExtra = false;
        let abonoMensualidad = false;
        debugger;
        switch ((value)) {
            case "1":
                abonoExtra = false;
                break;

            case "3":
                abonoMensualidad = true;
                this.setState({
                    montoAbono: this.props.student.priceLesson
                }, () => {
                    M.updateTextFields();
                })
                break;
            default:
                abonoExtra = true;
                break;
        }
        this.setState({ abonoExtra, abonoMensualidad }, () => {
            if (abonoExtra || abonoMensualidad) {
                M.FormSelect.init(document.querySelectorAll('select'), {
                });
            }
        });
    }


    render() {

        let { abonoExtra, extras, extraId, montoAbono, errors, abonoMensualidad, month, year, years } = this.state;
        if (!extras.length) {
            return <h4>No cuenta con adicionales.</h4>
        }
        return (
            <div id="abonoModal" className="">
                <div className="">
                    <div className="divider"></div>

                    <div className="row z-depth-2">
                        <form onSubmit={this.submitAbono} className="col s12">
                            <div className="col s12 ">
                                <p>¿Qué vamos a abonar?</p>
                                <div className="row">
                                    <div className="col s6">
                                        {/* <label>
                                            <input name="payment" value="1" type="radio" onChange={this.toPay} checked={abonoExtra === false && abonoMensualidad === false} />
                                            <span>Clase</span>
                                        </label> */}
                                        <label hidden={extras.length}>
                                            <input name="payment" value="2" type="radio" onChange={this.toPay} checked={abonoExtra} />
                                            <span>Extra</span>
                                        </label>
                                        {/* {
                                            this.props.student.methodPayment === 1 ?
                                                <label>
                                                    <input name="payment" value="3" type="radio" onChange={this.toPay} checked={abonoMensualidad} />
                                                    <span>Mensualidad</span>
                                                </label>
                                                : null
                                        } */}
                                    </div>
                                </div>
                            </div>
                            <div className="col s12">
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="montoAbono" type="text"
                                        value={montoAbono}
                                        onChange={this.changeValue}
                                        className={`${errors.montoAbono ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="montoAbono">Monto a abonar:</label>
                                    <span className="helper-text" data-error={errors.montoAbono}></span>
                                </div>
                                {
                                    abonoExtra ?
                                        <div className="input-field col s12 m6 l6 xl6">
                                            <select onChange={this.changeValue} id="extraId"
                                                className={`${errors.monto ? "invalid" : ""} `}
                                                value={extraId}
                                            >
                                                <option value="" disabled>Conceptos:</option>
                                                {
                                                    extras.map((value, index) => {
                                                        if (!value.finished && !value.canceled) {
                                                            return (
                                                                <option value={value._id} key={index}>
                                                                    {value.concept} - (Pendiente {value.remaining ?
                                                                        `$${parseFloat(Math.round(value.remaining * 100) / 100).toFixed(2)}`
                                                                        :
                                                                        `$${parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)}`
                                                                    })
                                                                </option>
                                                            )
                                                        } else {
                                                            return null;
                                                        }


                                                    })
                                                }
                                            </select>
                                            <label>Elija un concepto</label>
                                            <span className="red-text">{errors.extraId}</span>
                                        </div>
                                        : null
                                }
                                {
                                    abonoMensualidad ?
                                        <div className="input-field col s12 m3 l3 xl3">
                                            <select onChange={this.changeValue} id="month"
                                                className={`${errors.month ? "invalid" : ""} `}
                                                value={month}
                                            >
                                                <option value="">Elija una opción</option>
                                                <option value="1">Enero</option>
                                                <option value="2">Febrero</option>
                                                <option value="3">Marzo</option>
                                                <option value="4">Abril</option>
                                                <option value="5">Mayo</option>
                                                <option value="6">Junio</option>
                                                <option value="7">Julio</option>
                                                <option value="8">Agosto</option>
                                                <option value="9">Septiembre</option>
                                                <option value="10">Octubre</option>
                                                <option value="11">Noviembre</option>
                                                <option value="12">Diciembre</option>
                                            </select>
                                            <span className="red-text">{errors.month}</span>
                                        </div>
                                        : null
                                }
                                {
                                    abonoMensualidad ?
                                        <div className="input-field col s12 m3 l3 xl3">
                                            <select onChange={this.changeValue} id="year"
                                                className={`${errors.year ? "invalid" : ""} `}
                                                value={year}
                                            >
                                                <option value="">Elija una opción</option>
                                                {
                                                    years.map((value, index) => {
                                                        return (
                                                            <option value={value}
                                                                key={index}
                                                            >{value}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <span className="red-text">{errors.year}</span>
                                        </div>
                                        : null
                                }
                                <div className="col s12 center-align mb-1">
                                    <button className="btn green w-100 waves-effect">Aplicar</button>
                                </div>
                            </div>
                            {
                                this.state.printTicket && this.state.pagosRealizados.length ?
                                    <div className="col s12">
                                        <ReactToPrint
                                            trigger={() => <a href="#!">Imprimir Ticket</a>}
                                            content={() => this.componentRef}
                                        />
                                        <ComponentToPrint ref={el => (this.componentRef = el)}
                                            data={this.state} student={this.props.student}
                                            extras={extras}
                                        />
                                    </div>

                                    : null
                            }

                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default AbonoForm;