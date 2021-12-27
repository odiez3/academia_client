import React, { Component } from 'react';
import { URL_API } from '../properties';
import axios from 'axios';
import M from 'materialize-css';

import AlumnoForm from './alumnoForm.cmpt';
import ExcelReader from './ExcelReader';

class ListAlumnos extends Component {


    state = {
        students: [],
        limit: 10,
        total_items: 0,
        page: 1,
        total_pages: 0,
        consecutivo: "",
        errors: {},
        searchBy: false,
        student: false,
    }

    componentDidMount() {
        this.initSelect();
        this.getStudents();
    }

    initSelect() {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    }

    next = () => {
        let { page, total_pages } = this.state;
        let nextPage = page + 1;
        if (nextPage <= total_pages) {
            this.setState({ page: nextPage }, () => {
                this.getStudents();
            });
        }
    }

    editStudent = (value, event) => {

        this.setState({ student: value }, () => {
            let modalIntance = M.Modal.getInstance(document.getElementById('formAlumno'));
            modalIntance.open();
        });
    }

    more = (value, event) => {

        this.props.history.push(`/dashboard/mas/${value.consecutivo}`)
    }

    back = () => {
        let { page } = this.state;
        let nextPage = page - 1;
        if (nextPage > 0) {
            this.setState({ page: nextPage }, () => {
                this.getStudents();
            });
        }
    }

    getStudents = async () => {
        let { page, limit } = this.state;
        try {
            let response = await axios.post(`${URL_API}/students/${page}`, { limit });
            let { data } = response;
            let total_pages = Math.ceil(data.total_items / limit);
            this.setState({ students: data.students, total_items: data.total_items, total_pages, searchBy: false, student: false }, () => {
                if (!this.state.searchBy) {
                    this.initSelect();
                }
            });

        } catch (error) {

            console.log(error);
            M.toast({ html: "Ocurrio un error al cargar los elementos.", classes: "red" });
        }
    }

    changeValue = (event) => {
        let { id, value } = event.target;

        if (id === "limit") {
            value = parseInt(value);
        }
        this.setState({ [id]: value }, () => {
            if (id === "limit") {
                this.getStudents();
            } else if (id === "consecutivo" && value.trim() === "") {
                this.getStudents();
            }
        });
    }

    getConsecutivo = (event) => {
        event.preventDefault();
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
                    this.setState({ students: [rs.data], searchBy: "ID" });
                }).catch((error) => {
                    if (error.response) {
                        let { data } = error.response;
                        M.toast({ html: data.message, classes: "red" })
                    }
                });
            }

        } else {
            this.setState({ errors });
        }
    }

    importarData = (data) => {

        if (data.length > 0) {
            data.forEach(async (st, index) => {
                let student = {
                    name: st.Nombre,
                    image: "null",
                    tel: st.tel,
                    emergency: st.telEmergencia,
                    birthday: `${new Date(st.fchNac).getTime()}`,
                    priceLesson: parseFloat(st.precioClase),
                    debtLimit: parseFloat(st.limiteDeuda),
                    observations: st.observaciones ? st.observaciones : "",
                    methodPayment: st.formaPago === "CLASE" ? 3 : 1,
                    consecutivo: st.consecutivo ? st.consecutivo : index + 1
                }

                try {
                    let rs = await axios.post(`${URL_API}/addStudent`, student);
                    if (rs.data) {
                        M.toast({ html: `Datos de ${student.name} Guardados Éxitosamente. <i class="material-icons">check</i>`, classes: "green" });
                    }
                } catch (error) {
                    console.log(error);
                    if (error.response) {
                        M.toast({ html: `${error.response.data.message}`, classes: "red" });
                    } else {
                        M.toast({ html: `No se lograrón guardar los datos del alumno ${student.name}`, classes: "red" });
                    }
                }

            });
        }

    }


    render() {
        let { students, page, total_pages, limit, consecutivo, errors, searchBy } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col s6">
                        <h4>Alumnos</h4>
                    </div>
                    <div className="col s6">
                        <ExcelReader importar={this.importarData} />
                    </div>
                    <div className="col s12">
                        <div className="divider" />
                    </div>
                </div>
                <div className="row">

                    <form className="input-field col s8" onSubmit={this.getConsecutivo}>
                        <i className="material-icons prefix">search</i>
                        <input id="consecutivo" type="text" value={consecutivo} className={
                            ` ${errors.consecutivo ? "invalid" : ""} `
                        }
                            onChange={this.changeValue}
                        />
                        <label htmlFor="consecutivo">Nombre / ID</label>
                        <span className="helper-text" data-error={`${errors.consecutivo ? errors.consecutivo : ""}`}></span>
                    </form>
                    <div className="col s4 right-align">
                        {
                            !searchBy ?

                                <div className="input-field col s12">
                                    <select id="limit" value={limit} onChange={this.changeValue}>
                                        <option value="10">10</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                    <label>No. Registros</label>
                                </div>
                                : null
                        }

                    </div>
                    <div className="col s12">
                        <table className="highlight">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th className="center-align">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    students.length && students.map((value, index) => {
                                        return <tr key={index}><td>{value.consecutivo}</td><td>{value.name}</td><td className="center-align">
                                            <button className="btn btn-flat waves-effect waves-black"
                                                type="button" onClick={this.editStudent.bind(this, value)}
                                            ><i className="material-icons">edit</i>
                                            </button>
                                            <button className="btn btn-flat waves-effect waves-black"
                                                type="button" onClick={this.more.bind(this, value)}
                                            ><i className="material-icons">add</i>
                                            </button></td></tr>;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    !searchBy ?
                        <div className="row">
                            <div className="col s12 center-align">
                                <button className="btn btn-flat waves-effect waves-black"
                                    disabled={page === 1 ? true : false}
                                    onClick={this.back}
                                >
                                    <i className="material-icons">arrow_back</i></button>
                                <label className="black-text">pág. {page} de {total_pages}</label>
                                <button className="btn btn-flat waves-effect waves-black"
                                    onClick={this.next}
                                    disabled={page === total_pages ? true : false}
                                ><i className="material-icons">arrow_forward</i>
                                </button>
                            </div>
                        </div>

                        : null
                }
                <div className="row">
                    <div className="fixed-action-btn">
                        <a className="btn-floating btn-large red" href="#!"
                            onClick={() => {
                                this.setState({ student: false }, () => {
                                    let modalIntance = M.Modal.getInstance(document.getElementById('formAlumno'));
                                    modalIntance.open();
                                });
                            }}
                        >
                            <i className="large material-icons">add_circle_outline</i>
                        </a>
                    </div>
                </div>

                <AlumnoForm reload={this.getStudents} toEdit={this.state.student} />
            </div>
        )
    }
}


export default ListAlumnos;