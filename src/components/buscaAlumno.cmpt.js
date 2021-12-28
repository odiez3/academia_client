import React, { Component } from 'react';
import { URL_API, PRICE_WEEKEND, WEKS_DAYS } from '../properties';
import { Link } from 'react-router-dom';
import axios from 'axios';
import M from 'materialize-css';

import ByName from './searchByName.cmpt';
import DetailStudent from './detailStudent';
import AdicionalForm from './adicionalForm.cmpt';


class BuscaAlumno extends Component {


    state = {
        consecutivo: "",
        errors: {},
        student: false,
        searchBy: "ID",
        students: false,
        user: false,
        realoadExtras: false
    }

    componentDidMount = () => {
        let user = localStorage.getItem('user');
        this.setState({ user: JSON.parse(user) });
    }

    changeValue = (event) => {
        let { id, value } = event.target;
        let { errors } = this.state;
        errors[id] = null;
        this.setState({ [id]: value, errors, student: false });
    }
    submitSearch = (event) => {
        event.preventDefault();

        this.setState({ student: false }, () => {
            let { consecutivo, errors } = this.state;
            let valido = true;
            if (consecutivo.trim() === "") {
                errors.consecutivo = "Ingrese el Número o Nombre del Estudiante.";
                valido = false;
            }
            if (valido) {
                if (isNaN(consecutivo)) {
                    axios.post(`${URL_API}/getStudentByName`, { name: consecutivo }).then((rs) => {
                        let students = rs.data.students;
                        this.setState({ students, searchBy: "NAME" });
                    }).catch((error) => {
                        if (error.response) {
                            let { data } = error.response;
                            this.setState({
                                students: false
                            });
                            M.toast({ html: data.message, classes: "red" })
                        }
                    });
                } else {
                    axios.post(`${URL_API}/getStudentByID`, { consecutivo }).then((rs) => {
                        let student = rs.data;
                        this.setState({ student, students: false, searchBy: "ID" }, () => {
                            this.getTotalDebt();
                        });
                    }).catch((error) => {
                        console.log(error);
                        if (error.response) {
                            let { data } = error.response;

                            M.toast({ html: data.message, classes: "red" })

                        }
                    });
                }

            } else {
                this.setState({ errors });
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

    realoadExtras = () => {
        this.setState({ reload: true });
    }


    aplicaAsistencia = () => {
        let { student } = this.state;
        // let data = {
        //     "id": student._id,
        //     "priceLesson": student.priceLesson,
        //     "methodPayment": student.methodPayment,
        //     "priceWeekend": PRICE_WEEKEND
        // }
        debugger;
        let date = new Date();
        console.log(date.getDay());

        let data = {
            "id": student._id,
            "priceLesson": student.priceLesson,
            "priceWeekend": PRICE_WEEKEND,
            "paidOut": false,
            "assisted": true
        }

        console.log(JSON.stringify(data));
        debugger;
        if (student.methodPayment === 1 && WEKS_DAYS.indexOf(date.getDay()) === -1) {
            data.paidOut = true;
            data.priceLesson = 0;
        }


        axios.post(`${URL_API}/addAssistance`, data).then((response) => {
            console.log(response);
            M.toast({ html: `Asistencia aplicada correctamente. <i class="material-icons">check</i>`, classes: "green" })
        }).catch((error) => {
            debugger;
            console.log(error);
            if (error.response) {
                let { message } = error.response.data;
                M.toast({ html: message, classes: "red" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado.", classes: "red" });
            }
        });

    }


    render() {
        let { consecutivo, errors, searchBy, students, student, user, totalDebtLessons } = this.state;
        let { match } = this.props;
        return (
            <div className="container mt-1">
                <div className="row">
                    <div className="col s12">
                        <h4>Buscar Alumno</h4>
                    </div>
                    <div className="col s12">
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="row">
                    <form className="col s12" onSubmit={this.submitSearch}>
                        <div className="row">
                            <div className="input-field col s12 m12 l6 xl6">
                                <i className="material-icons prefix">search</i>
                                <input id="consecutivo" type="text" value={consecutivo} className={
                                    ` ${errors.consecutivo ? "invalid" : ""} `
                                }
                                    onChange={this.changeValue}
                                />
                                <label htmlFor="consecutivo">Nombre / ID</label>
                                <span className="helper-text" data-error={`${errors.consecutivo ? errors.consecutivo : ""}`}></span>
                            </div>
                        </div>
                    </form>
                    <div className="col s12">
                        <div className="divider"></div>
                    </div>
                </div>


                {
                    searchBy === "NAME" && students ?
                        <ByName students={students} />
                        :
                        searchBy === "ID" && student ?
                            <div className="row">
                                {
                                    student.monthPayless ?
                                        <div className="col s12 red darken-1 white-text">
                                            <p>Favor de pasar a pagar su mensualidad.</p>
                                        </div>
                                        : null
                                }
                                {
                                    totalDebtLessons >= student.debtLimit ?
                                        <div className="col s12 red darken-1 white-text">
                                            <p>Favor de liquidar deuda pendiente.</p>
                                        </div>
                                        : null

                                }
                                <DetailStudent student={student} />

                                <div className="row">
                                    <div className="col s12 m6 l6 xl6 center-align mt-1">
                                        <button type="button"
                                            onClick={this.aplicaAsistencia}
                                            className="btn green w-100 waves-effect" >
                                            <i className="material-icons left">pan_tool</i>Aplicar Asistencia
                                                </button>
                                    </div>
                                    {
                                        user.rol === "ROLE_ADMIN" ?
                                            <React.Fragment>
                                                <div className="col s12 m6 l6 xl6 center-align mt-1">
                                                    {/* <button type="button"
                                                    className="btn green waves-effect w-100 modal-trigger" href="#abonoModal" >
                                                    <i className="material-icons left">attach_money</i>Abonar
                                                </button> */}
                                                    <Link to={`${match.path}/abonos/${student.consecutivo}`}
                                                        className="btn green waves-effect w-100 modal-trigger" >
                                                        <i className="material-icons left">attach_money</i>Abonar
                                                </Link>
                                                </div>
                                                <div className="col s12 m6 l6 xl6 center-align mt-1">
                                                    <button type="button"
                                                        className="btn green waves-effect w-100 modal-trigger" href="#adicionalForm">
                                                        <i className="material-icons left">add_shopping_cart</i>Agregar Adicional
                                                </button>
                                                </div>
                                                {
                                                    student ?
                                                        <div className="col s12 m6 l6 xl6 center-align mt-1">
                                                            <Link to={`${match.path}/mas/${student.consecutivo}`}
                                                                className="btn green waves-effect w-100 modal-trigger" >
                                                                <i className="material-icons left">add</i>Mas
                                                </Link>
                                                        </div>
                                                        : null
                                                }
                                            </React.Fragment>

                                            : null
                                    }
                                </div>

                            </div>
                            : null
                }
                <AdicionalForm student={student} reload={this.state.reload} reloadExtras={this.realoadExtras} />
                {/* <AbonoForm student={student} reloadExtras={this.realoadExtras} reload={this.state.reload} /> */}
            </div>
        )
    }

}

export default BuscaAlumno;

