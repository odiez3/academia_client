import React, { Component } from 'react';
import { URL_API, MESES, DIAS, PRICE_WEEKEND, CLASS_DAYS } from '../properties';
import axios from 'axios';
import M from 'materialize-css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import logoSinImagen from '../assets/logoAcademia.jpg';
import Adicionales from '../components/infoAlumno/adicionales.cmtp';
import AbonoForm from './abonoForm.cmpt';
import ReactToPrint from "react-to-print";


class ComponentToPrint extends Component {
    state = {
        clasesDescuentos: [],
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

    getTotalClases() {
        let suma = 0;
        if (this.props.data.lesonPayed.length) {

            this.props.data.lesonPayed.forEach((value, index) => {
                suma += value.charge;
            });

        }
        return suma;
    }

    getMesPayed() {
        if (this.props.data.monthPayed) {
            let splitMonth = this.props.data.monthPayed.split(",");
            let mes = "";
            switch (parseInt(splitMonth[1])) {
                case 1:
                    mes = "Enero";
                    break;
                case 2:
                    mes = "Febrero";
                    break;
                case 3:
                    mes = "Marzo";
                    break;
                case 4:
                    mes = "Abril";
                    break;
                case 5:
                    mes = "Mayo";
                    break;
                case 6:
                    mes = "Junio";
                    break;
                case 7:
                    mes = "Julio";
                    break;
                case 8:
                    mes = "Agosto";
                    break;
                case 9:
                    mes = "Septiembre";
                    break;
                case 10:
                    mes = "Octubre";
                    break;
                case 11:
                    mes = "Noviembre";
                    break;
                case 12:
                    mes = "Diciembre";
                    break;
                default:
                    mes = splitMonth[1];
            }
            return `${mes} de ${splitMonth[0]}`;
        }

        return "";
    }


    getTotalClasesToPay() {
        let total = 0;
        let totalDescuento = 0;
        let clasesDescuentos = [];
        if (this.props.data.datesToPrint.length) {
            let count = 0;

            this.props.data.datesToPrint.forEach((value, index) => {
                var dateObj = new Date(value);
                var currentDay = dateObj.getDay();
                if (currentDay !== 4) {
                    count += 1;
                    total += this.props.data.student.priceLesson;
                } else if (currentDay === 4 && count === 3) {
                    count = 0; //Reinicia el contador
                    total += this.props.data.student.priceLesson;
                    // clasesDescuentos.push({
                    //     date: value,
                    //     monto: this.props.data.student.priceLesson
                    // });
                    //totalDescuento += this.props.data.student.priceLesson;
                } else if (currentDay !== 4 && count === 3) {
                    total += this.props.data.student.priceLesson;
                    count = 0;
                } else if (currentDay === 4 && count < 3) {
                    total += this.props.data.student.priceLesson;
                    count = 0;
                }
                console.log(currentDay);
            });

        }


        return {
            total,
            clasesDescuentos,
            totalDescuento
        };
    }

    getMensualidad() {
        let montly = 0;
        if (this.props.data.monthPayed) {
            montly = this.props.student.priceLesson;
        }

        return montly;
    }

    render() {
        console.log(this.props.data)
        return (
            <div className="container contentTicket">
                <div className="row ticket">
                    <div className="col s12 left-align">
                        <p>Academia Gladiadores</p>
                        <p>Dirección: Calle Heroes de Tlapacoyan 315</p>
                        <p>Tel: 225 101 8148</p>
                        <p>Fecha:{this.plantillaFecha(new Date())}</p>
                        {
                            this.props.data.ticketId ?
                            <p>Folio Ticket: {this.props.data.ticketId}</p>
                            : null
                        }
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
                            this.props.data.datesToPrint.map((value, index) => {
                                return (<p key={index}>Clase -- {this.plantillaFecha(value)} --- ${parseFloat(Math.round(this.props.student.priceLesson * 100) / 100).toFixed(2)}</p>)
                            })
                        }
                        {
                            this.props.data.lesonPayed.map((value, index) => {
                                return (<p key={index}>Clase -- {this.plantillaFecha(value.assistence)} --- ${parseFloat(Math.round(value.charge * 100) / 100).toFixed(2)}</p>)
                            })
                        }
                        {
                            this.props.data.monthPayed ?
                                <p>Mensualidad de {this.getMesPayed()} --- ${parseFloat(Math.round(this.props.student.priceLesson * 100) / 100).toFixed(2)}</p>
                                : null
                        }
                        {/* {
                            this.getTotalClasesToPay().clasesDescuentos.length ?
                                <div>
                                    <p>Descuento Clases======</p>
                                    {
                                        this.getTotalClasesToPay().clasesDescuentos.map((value, index) => {
                                            return <p>Clase - {this.plantillaFecha(value.date)} -- (-${parseFloat(Math.round(value.monto * 100) / 100).toFixed(2)})</p>
                                        })
                                    }
                                </div>
                                : null
                        } */}
                        <p>=================================</p>
                    </div>
                </div>
                <div className="row ticket">
                    <div className="col s12 left-align">

                        {
                            this.getTotalClasesToPay().total ?
                                <p>Total clases ----- ${parseFloat(Math.round(this.getTotalClasesToPay().total * 100) / 100).toFixed(2)} </p>
                                : null
                        }
                        {/* {
                            this.getTotalClasesToPay().totalDescuento ?
                                <p>Descuento -- (-${parseFloat(Math.round(this.getTotalClasesToPay().totalDescuento * 100) / 100).toFixed(2)}) </p>
                                : null
                        } */}
                        {

                        }
                        <p>Total ----- ${parseFloat(Math.round(((this.getTotalClasesToPay().total) + this.getTotalClases() + this.getMensualidad()) * 100) / 100).toFixed(2)}</p>
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
                    this.props.totalDebtLessonsFormat !== "$0.00" ?
                        <div className="row ticket">
                            <div className="col s12 left-align">

                                <p>Deuda Clases ---- {this.props.totalDebtLessonsFormat} </p>
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


class Abonos extends Component {

    state = {
        monthPayed: false,
        printTicket: false,
        student: false,
        totalDebtLessons: 0,
        totalDebtLessonsFormat: "",
        asistenciasPorPagar: true,
        abonar: false,
        adicionales: false,
        asistencias: [],
        date: new Date(),
        datesSelected: [],
        datesToPrint: [],
        reload: false,
        errors: {},
        years: [],
        monthSelected: "",
        yearSelected: "",
        extras: [],
        lesonPayed: []
    }

    componentDidMount() {
        let currentDate = new Date();
        let years = [];
        years.push(currentDate.getFullYear());
        years.push(currentDate.getFullYear() + 1);
        this.setState({ years });
    }

    getExtras() {
        let { student } = this.state;

        if (student) {
            axios.post(`${URL_API}/getExtras`, { id: student._id }).then((response) => {
                if (response.data) {
                    console.log(response.data);
                    this.setState({ extras: response.data });
                }
            });
        }
    }

    changeValue = (event) => {

        let { id, value } = event.target;
        let { errors } = this.state;
        errors[id] = null;

        this.setState({ [id]: value, errors }, () => {
            let { monthSelected, yearSelected } = this.state;
            if (monthSelected !== "" && yearSelected !== "") {
                this.getDaysInMonth();
            }
        });
    }

    getTotalDebt() {
        let { student } = this.state;
        axios.post(`${URL_API}/getTotalDebtLessons`, { id: student._id }).then((result) => {
            if (result.data) {
                this.setState({
                    totalDebtLessons: result.data.totalDebt,
                    totalDebtLessonsFormat: `$${parseFloat(Math.round(result.data.totalDebt * 100) / 100).toFixed(2)}`
                })
            }
        });
    }

    getAsistenciasPorPagar() {
        let { student } = this.state;
        axios.post(`${URL_API}/getLessonsNoPaid`, { id: student._id }).then((result) => {
            if (result.data) {
                this.setState({ asistencias: result.data.clases })
            }
        });

    }

    UNSAFE_componentWillMount() {

        let { consecutivo } = this.props.match.params;
        axios.post(`${URL_API}/getStudentByID`, { consecutivo: parseInt(consecutivo) }).then((result) => {

            if (result.data) {
                this.setState({ student: result.data }, () => {
                    this.getTotalDebt();
                    this.getAsistenciasPorPagar();
                    this.getExtras();
                });
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

    clickDate = date => {
        let { datesSelected } = this.state;
        //Revisa eu no este en la lista
        let encontro = -1;
        if (datesSelected.length) {

            datesSelected.forEach((d, index) => {
                if (d.getTime() === date.getTime()) {
                    encontro = index;
                }
            });
        }

        if (encontro >= 0) {
            datesSelected.splice(encontro, 1);
        } else {
            datesSelected.push(date);
        }

        console.log(datesSelected);

        this.setState({ datesSelected });
    }



    render() {
        let { totalDebtLessonsFormat, totalDebtLessons, student, printTicket, asistenciasPorPagar, datesSelected, datesToPrint, adicionales, errors, monthSelected, yearSelected, years, extras } = this.state;
        return (
            <div className="container">
                <div className="row mt-1">
                    <div className="col s12 m3 l3 xl3 align-left">
                        {
                            student.image === "null" ?
                                <img src={logoSinImagen} alt={student.name} className="responsive-img circle img-r" />
                                :
                                <img src={student.image} alt={student.name} className="responsive-img img-r" />

                        }

                    </div>
                    <div className="col s12 m9 l9 xl9">
                        <h5>{student.name}</h5>
                        {
                            totalDebtLessons > 0 ?
                                <p style={{ maxWidth: "400px" }}>
                                    Deuda Clases:
                                    <span className={
                                        totalDebtLessons >= student.debtLimit ?
                                            "badge red white-text" : "badge green white-text"
                                    }
                                    >{totalDebtLessonsFormat}</span>
                                </p>
                                : null
                        }
                        <p style={{ maxWidth: "400px" }}>
                            Costo
                                    {
                                student.methodPayment === 3 ?
                                    " Clase" : " Mensualidad"
                            }
                            :
                                    <span className="badge green white-text"

                            >{`$${parseFloat(Math.round(student.priceLesson * 100) / 100).toFixed(2)}`}</span>
                        </p>

                    </div>
                    <div className="col s12">
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button className="btn"
                            onClick={() => {
                                if (student.methodPayment === 1 && this.state.abonar) {
                                    M.FormSelect.getInstance(document.getElementById('monthSelected')).destroy();
                                    M.FormSelect.getInstance(document.getElementById('yearSelected')).destroy();

                                }

                                this.setState({ asistenciasPorPagar: true, abonar: false, adicionales: false, printTicket: false }, () => {
                                    this.getAsistenciasPorPagar();
                                })
                            }}
                        >Por Pagar</button>
                        <button className="btn ml-1" onClick={() => {
                            this.setState({ asistenciasPorPagar: false, adicionales: false, abonar: true, printTicket: false, lesonPayed: [], monthPayed: false }, () => {
                                if (student.methodPayment === 1) {
                                    M.FormSelect.init(document.querySelectorAll('select'), {
                                    });
                                }
                            })
                        }}>Abonar</button>
                        <button className="btn ml-1" onClick={() => { this.setState({ asistenciasPorPagar: false, abonar: false, adicionales: true, printTicket: false }) }}>Adicionales</button>
                    </div>
                </div>

                {
                    !adicionales ?
                        asistenciasPorPagar ?
                            this.asistenciasPorPagarCmp()
                            :
                            student.methodPayment === 3 ?

                                <div className="row">
                                    <div className="col s12">
                                        <h6>Elija las fechas a abonar:</h6>
                                    </div>
                                    <div className="col s12">
                                        <div className="divider"></div>
                                    </div>
                                    <div className="col s12 l6 xl6 mt-1">
                                        <Calendar
                                            defaultValue={this.state.datesSelected}
                                            onClickDay={this.clickDate}
                                            returnValue="start"
                                            value={this.state.date}
                                            tileDisabled={({ activeStartDate, date, view }) => (date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0) && (view === "month")
                                            }
                                            tileClassName={({ activeStartDate, date, view }) => {
                                                if (view === "month") {
                                                    for (var d of this.state.datesSelected) {
                                                        if (d.getTime() === date.getTime()) {
                                                            return "red white-text"
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    {
                                        datesSelected.length ?

                                            <div className="col s12 l6 xl6 mt-1">
                                                <p>
                                                    Costo: {`$${parseFloat(Math.round(student.priceLesson * 100) / 100).toFixed(2)}`}
                                                </p>
                                                <p>
                                                    Total:  {`$${parseFloat(Math.round((student.priceLesson * datesSelected.length) * 100) / 100).toFixed(2)}`}
                                                </p>
                                                <button className="btn" onClick={this.abonarDates}>Abonar</button>
                                            </div>

                                            : null

                                    }

                                    {
                                        datesToPrint.length && printTicket ?

                                            <div className="col s12 m6 l6 xl6">
                                                <ReactToPrint
                                                    trigger={() => <a href="#!">Imprimir Ticket</a>}
                                                    content={() => this.componentRef}
                                                />
                                                <ComponentToPrint ref={el => (this.componentRef = el)}
                                                    data={this.state} student={student}
                                                    extras={extras} 
                                                    totalDebtLessonsFormat={totalDebtLessonsFormat}
                                                />

                                            </div>

                                            : null
                                    }


                                </div>
                                :
                                <div className="row">
                                    <div className="col s12">
                                        <h6>Elija el mes a abonar:</h6>
                                    </div>
                                    <div className="col s12">
                                        <div className="divider"></div>
                                    </div>
                                    <div className="input-field col s4">
                                        <select onChange={this.changeValue} id="monthSelected"
                                            className={`${errors.monthSelected ? "invalid" : ""} `}
                                            value={monthSelected}
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
                                    <div className="input-field col s4">
                                        <select onChange={this.changeValue} id="yearSelected"
                                            className={`${errors.yearSelected ? "invalid" : ""} `}
                                            value={yearSelected}
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
                                        <span className="red-text">{errors.yearSelected}</span>
                                    </div>

                                    <div className="col s4 mt-1">
                                        {
                                            datesSelected.length ?
                                                <button className="btn" onClick={this.payMonth}>Abonar</button>
                                                : null
                                        }
                                    </div>
                                    {
                                        this.state.monthPayed && this.state.abonar ?
                                            <div className="col s12 m6 l6 xl6">
                                                <ReactToPrint
                                                    trigger={() => <a href="#!">Imprimir Ticket</a>}
                                                    content={() => this.componentLeson}
                                                />
                                                <ComponentToPrint ref={el => (this.componentLeson = el)}
                                                    data={this.state} student={student}
                                                    extras={extras}
                                                    totalDebtLessonsFormat={totalDebtLessonsFormat}
                                                />

                                            </div>

                                            : null
                                    }
                                </div>
                        : null
                }



                {
                    adicionales && student ?
                        <React.Fragment>
                            <AbonoForm student={student} reloadExtras={this.realoadExtras} reload={this.state.reload} />
                            <Adicionales student={student} reload={this.state.reload} reloadExtras={this.realoadExtras} />
                        </React.Fragment>


                        : null
                }
            </div>
        )
    }

    abonarDates = async () => {
        let { student, datesSelected } = this.state;
        //Lo acomoda de menor a mayor
        datesSelected.sort((a, b) => {
            return a > b ? -1 : a < b ? 1 : 0;
        }).reverse();

        let datesToPrint = [];

        for (var d of datesSelected) {

            var month = d.getUTCMonth() + 1; //months from 1-12
            var day = d.getDate();
            var year = d.getUTCFullYear();

            let dateAssistance = new Date(year + "/" + month + "/" + day);
            let data = {
                "id": student._id,
                "priceLesson": student.priceLesson,
                "priceWeekend": PRICE_WEEKEND,
                "assisted": false,
                "paidOut": true,
                "date": dateAssistance,
                "isAbono": true,
                ticketId: this.state.ticketId || false 
            }
            try {
              
                let response = await axios.post(`${URL_API}/addAssistance`, data);
                if (response) {
                    if(response.data && response.data.paymentStored){
                         this.setState({ticketId:response.data.paymentStored.ticketId});
                    }
                   
                    this.getTotalDebt();
                    M.toast({ html: "Se pago la clase correctamente", classes: "green" });
                }
                datesToPrint.push(dateAssistance);
            } catch (error) {
                if (error.response) {
                    M.toast({ html: error.response.data.message, classes: "red" });
                }
            }

        }

        this.setState({ datesSelected: [], printTicket: true, datesToPrint });
    }

    payLesson = (lesson) => {
        let { lesonPayed } = this.state;
        axios.post(`${URL_API}/payLesson`, { id: lesson._id }).then((result) => {

            M.toast({ html: result.data.message, classes: "green" });
            this.getAsistenciasPorPagar();
            this.getTotalDebt();
            this.getExtras();
            lesonPayed.push(lesson);

            this.setState({ lesonPayed, printTicket: lesonPayed.length ? true : false });

        }).catch((error) => {
            if (error.response) {

                M.toast({ html: error.response.data.message, classes: "red" });

            } else {
                M.toast({ html: "No se logro recuperar la información del alumno", classes: "red" });
            }
        })
    }

    realoadExtras = () => {
        this.setState({ reload: true });
    }

    asistenciasPorPagarCmp() {

        let { asistencias, lesonPayed, printTicket, student, extras,totalDebtLessonsFormat } = this.state;

        return (
            <div className="row">
                <div className="col s12">
                    <h6>Por Pagar</h6>
                </div>
                <div className="col s12">
                    <div className="divider"></div>
                </div>
                <div className="col s12 m6 l6 xl6">

                    {
                        asistencias.length ?

                            <ul className="collection">
                                {
                                    asistencias.map((value, index) => {
                                        let f = new Date(value.assistence);
                                        let format = DIAS[f.getDay()] + " " + f.getDate() + " de " + MESES[f.getMonth()] + " del " + f.getFullYear() + " ";
                                        return (
                                            <li className="collection-item" key={value._id}><div>{format}
                                                <div className="secondary-content">
                                                    <i className="material-icons right waves-effect"
                                                        onClick={() => {
                                                            this.payLesson(value);
                                                        }}
                                                    >send</i>
                                                    {`$${parseFloat(Math.round(value.charge * 100) / 100).toFixed(2)}`} Pagar
                                                </div>
                                            </div></li>
                                        )
                                    })
                                }
                            </ul>
                            :
                            <h4>No cuenta con asistencias por pagar.
                            <i className="material-icons green-text right">check_circle</i>
                            </h4>
                    }
                </div>
                <div className="col s12 m6 l6 xl6">
                    {
                        lesonPayed.length && printTicket ?
                            <div>
                                <ReactToPrint
                                    trigger={() => <a href="#!">Imprimir Ticket</a>}
                                    content={() => this.componentLeson}
                                />
                                <ComponentToPrint ref={el => (this.componentLeson = el)}
                                    data={this.state} student={student}
                                    extras={extras}
                                    totalDebtLessonsFormat={totalDebtLessonsFormat}
                                />

                            </div>

                            : null
                    }
                </div>

            </div>
        )
    }

    payMonth = () => {

        let { yearSelected, monthSelected, student } = this.state;
        if (yearSelected.trim() !== "" && monthSelected.trim() !== "") {
            axios.post(`${URL_API}/payMonth`, {
                id: student._id, payment: student.priceLesson,
                month: monthSelected, year: yearSelected
            }).then((result) => {
                if (result.data) {
                    M.toast({ html: result.data.message, classes: "green" });

                    this.setState({ yearSelected: "", monthSelected: "", monthPayed: `${yearSelected},${monthSelected}` });
                }
            }).catch((error) => {
                if (error.response) {
                    M.toast({ html: error.response.data.message, classes: "red" });
                } else {
                    M.toast({ html: "No se logro aplicar la mensualidad.", classes: "red" });
                }
            });
        }
    }

    getDaysInMonth = () => {

        let { monthSelected, yearSelected } = this.state;
        let month = monthSelected;
        if (monthSelected < 10) {
            month = "0" + monthSelected;
        }
        let date = new Date(yearSelected + "/" + month + "/01");
        // var date = new Date(Date.UTC(yearSelected, monthSelected, 1));
        var days = [];
        while (date.getMonth() + 1 === parseInt(monthSelected)) {
            let dateToPush = new Date(date);

            if (CLASS_DAYS.indexOf(dateToPush.getDay()) >= 0) {
                days.push(dateToPush);
            }
            date.setDate(date.getDate() + 1);
        }

        this.setState({ datesSelected: days });
    }

}


export default Abonos;