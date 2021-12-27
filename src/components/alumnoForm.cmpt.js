import React, { Component } from 'react';
import M from 'materialize-css';
import { PRICE_LESSON, PRICE_MONTH, PRICE_WEEK, URL_API } from '../properties';
import axios from 'axios';

class AlumnoForm extends Component {


    state = {
        name: "",
        id: "",
        image: "null",
        tel: "",
        emergency: "",
        birthday: false,
        priceLesson: PRICE_MONTH,
        debtLimit: 0,
        observations: "",
        methodPayment: 1,
        errors: {},
        localUrl: false,
        file: false,
        formAlumno: false
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (nextProps.toEdit) {

            let student = nextProps.toEdit;
            student.id = student._id;
            delete student._id;
            this.setState(student, () => {
                setTimeout(()=>{
                    console.log(student.birthday);
                    let fch = new Date(parseInt(student.birthday));
                    document.getElementById("birthday").setAttribute('value',
                    `${fch.getDate()}-${fch.getMonth()+1}-${fch.getFullYear()}`
                    );
                    M.updateTextFields();
                },500)
          
                M.updateTextFields();
                this.initDatePicker();
            });
        } else {
            this.setState({
                name: "", id: "", image: "null",
                tel: "", emergency: "", birthday: "",
                priceLesson: PRICE_MONTH, debtLimit: 0,
                observations: "",
                methodPayment: 1,
                errors: {},
                localUrl: false,
                file: false,
            },()=>{
                document.getElementById("birthday").setAttribute('value',
                ""
                );
            })
        }
    }

    componentDidMount = () => {
        var elems = document.getElementById('formAlumno');
        var formAlumno = M.Modal.init(elems, { dismissible: true });
        this.setState({ formAlumno });
        this.initDatePicker();
    }

    initDatePicker(){
        M.Datepicker.init(document.querySelectorAll('.datepicker'), {
            onSelect: this.changeBirthday,
            yearRange: 70,
            defaultDate: this.props.student ? new Date(parseInt(this.props.student.birthday)) :  new Date(),
            format: 'dd-mm-yyyy',
            i18n: {
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
                weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
                weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
                cancel: 'Cancelar',
                clear: 'Limpar',
                done: 'Ok'
            }
        });
    }

    changeBirthday = (event) => {

        console.log(event);
        let { errors } = this.state;
        errors.birthday = null;
        this.setState({ birthday: event, errors });
    }

    changePayment = (event) => {
        let { value } = event.target;
        let priceLesson = PRICE_MONTH;
        switch ((value)) {
            case "2":
                priceLesson = PRICE_WEEK;
                break;
            case "3":
                priceLesson = PRICE_LESSON;
                break;
            default:
                priceLesson = PRICE_MONTH;
                break;
        }
        this.setState({ methodPayment: parseInt(value), priceLesson });
    }

    changeValue = (event) => {
        let { id, value } = event.target;
        let { errors } = this.state;
        errors[id] = null;

        this.setState({ [id]: value, errors });
    }

    openFiles = (event) => {
        document.getElementById('imgUser').click();
    }


    submitAlumno = (event) => {
        event.preventDefault();

        let { name, id, image, tel, emergency, birthday, priceLesson, debtLimit, observations, methodPayment, errors,  file, formAlumno } = this.state;
        let valido = true;

        // if (image.trim() === "") {
        //     if (!localUrl) {
        //         errors.image = "Elija una imagen para el alumno.";
        //     }
        // }
        if (name.trim() === "") {
            valido = false;
            errors.name = "Ingrese un nombre.";
        }
        if (tel.trim() === "") {
            valido = false;
            errors.tel = "Ingrese un teléfono de contacto.";
        }

        if (emergency.trim() === "") {
            valido = false;
            errors.emergency = "Ingrese un teléfono de emergencia.";
        }

        if (!birthday) {
            valido = false;
            errors.birthday = "Ingrese la fecha de nacimiento.";
        }

        if (priceLesson.toString().trim() === "0" || priceLesson.toString().trim() === "") {
            valido = false;
            errors.priceLesson = "Ingrese el precio sugerido para el alumno.";
        }

        if (debtLimit.toString().trim() === "0" || debtLimit.toString().trim() === "") {
            valido = false;
            errors.debtLimit = "Ingrese el límite de deuda para el alumno.";
        }



        if (valido) {

            if(typeof birthday === "string"){
                birthday = new Date(parseInt(birthday))
            }

            let student = {
                name: name,
                image,
                tel: tel,
                emergency: emergency,
                birthday: `${birthday.getTime()}`,
                priceLesson: parseFloat(priceLesson),
                debtLimit: parseFloat(debtLimit),
                observations: observations,
                methodPayment: parseInt(methodPayment)
            }

            if (id) {
                student.id = id;
            }
            axios.post(`${URL_API}/addStudent`, student).then((rs) => {

                let data = rs.data;

                if (file) {
                    let formData = new FormData();
                    formData.append('image', file);

                    axios.post(`${URL_API}/upload-image-student/${data._id}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then((ri) => {
                        M.toast({ html: `Datos Guardados Éxitosamente. <i class="material-icons">check</i>`, classes: "green" });
                        this.props.reload();
                        document.getElementById('birthday').setAttribute('value',"");
                        formAlumno.close();

                    }).catch((re) => {
                        M.toast({ html: "El alumno se genero, pero no se agrego su imagen de perfil.", classes: "yellow" });
                        this.props.reload();
                        formAlumno.close();

                    })
                } else {

                    M.toast({ html: `Datos Guardados Éxitosamente. <i class="material-icons">check</i>`, classes: "green" });
                    this.props.reload();
                    document.getElementById('birthday').setAttribute('value',"");
                    formAlumno.close();

                }


            }).catch((error) => {
                console.log(error);
                M.toast({ html: "No se lograrón guardar los datos.", classes: "red" });
            });

        } else {
            this.setState({ errors });
        }

    }

    changeFile = (event) => {

        console.log("hola");
        let { files } = event.target;
        if (files.length) {
            let { errors } = this.state;
            errors.image = null;
            let file = files[0];
            let localUrl = URL.createObjectURL(file);
            this.setState({ localUrl, errors, file });
        }

    }

    render() {
        let { errors, id, name, image, tel, emergency, priceLesson, localUrl, methodPayment, debtLimit, observations } = this.state;
        return (
            <div id="formAlumno" className="modal">
                <div className="modal-content">
                    <div className="row z-depth-2">
                        <div className="col s12">
                            <h6>{id ? "Actualizar Alumno" : "Agregar Alumnno"}</h6>
                        </div>
                        <div className="col s6">
                            <div className="divider"></div>
                        </div>
                    </div>
                    <div className="row z-depth-2">
                        <form className="col s12" onSubmit={this.submitAlumno}>
                            <div className="row mt-1">
                                <div className="col s12 center-align">
                                    {
                                        image.trim() !== "null" || localUrl ?

                                            <img src={

                                                localUrl ?
                                                    localUrl :
                                                    `${URL_API}/get-image-student/${image}`
                                            } className="responsive-img imgStudent" alt="imgStudent" />
                                            :
                                            null
                                    }

                                </div>
                                <div className="col s12 center-align">
                                    <button type="button" className="btn waves-effect"
                                        onClick={this.openFiles}
                                    >
                                        <i className="material-icons">
                                            camera_alt
                                        </i>
                                    </button>
                                </div>
                                {
                                    errors.image ?
                                        <div className="col s12 center-align">
                                            <p className="red-text" >{errors.image}</p>
                                        </div>
                                        : null
                                }
                            </div>
                            <div className="row">
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="name" type="text"
                                        value={name}
                                        onChange={this.changeValue}
                                        className={`${errors.name ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="name">Nombre Completo:</label>
                                    <span className="helper-text" data-error={errors.name}></span>
                                </div>

                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="tel" type="text" maxLength="10"
                                        value={tel}
                                        onChange={this.changeValue}
                                        className={`${errors.tel ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="tel">Teléfono:</label>
                                    <span className="helper-text" data-error={errors.tel}></span>
                                </div>

                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="emergency" type="text" maxLength="10"
                                        value={emergency}
                                        onChange={this.changeValue}
                                        className={`${errors.emergency ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="emergency">Teléfono de emergencia:</label>
                                    <span className="helper-text" data-error={errors.emergency}></span>
                                </div>

                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="birthday" type="text"
                                        className={`${errors.birthday ? "invalid" : ""} datepicker`}
                                    />
                                    <label htmlFor="birthday">Fecha de Nacimiento:</label>
                                    <span className="helper-text" data-error={errors.birthday}></span>
                                </div>
                                <div className="col s12">
                                    <p>Forma de Pago:</p>
                                    <div className="row">
                                        <div className="col s4">
                                            <label>
                                                <input name="payment" value="1" type="radio" onChange={this.changePayment} checked={methodPayment === 1} />
                                                <span>Mensual (${parseFloat(Math.round(PRICE_MONTH * 100) / 100).toFixed(2)})</span>
                                            </label>
                                        </div>
                                        <div className="col s4">
                                            <label>
                                                <input name="payment" value="3" type="radio" onChange={this.changePayment} checked={methodPayment === 3} />
                                                <span>Clase (${parseFloat(Math.round(PRICE_LESSON * 100) / 100).toFixed(2)})</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="priceLesson" type="text"
                                        value={priceLesson}
                                        onChange={this.changeValue}
                                        className={`${errors.priceLesson ? "invalid" : ""}`}
                                    />
                                    <label htmlFor="priceLesson">Precio Sugerido:</label>
                                    <span className="helper-text" data-error={errors.priceLesson}></span>
                                </div>
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="debtLimit" type="text"
                                        value={debtLimit}
                                        onChange={this.changeValue}
                                        className={`${errors.debtLimit ? "invalid" : ""}`}
                                    />
                                    <label htmlFor="debtLimit">LÍmite de Deuda:</label>
                                    <span className="helper-text" data-error={errors.debtLimit}></span>
                                </div>
                                <div className="input-field col s12">
                                    <textarea id="observations"
                                        value={observations}
                                        onChange={this.changeValue}
                                        className={`${errors.observations ? "invalid" : ""} materialize-textarea`}
                                    ></textarea>
                                    <label htmlFor="observations">Observaciones:</label>
                                    <span className="helper-text" data-error={errors.observations}></span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12">
                                    <div className="divider"></div>
                                </div>
                                <div className="col s12 center-align mt-1">
                                    <button className="btn w-100 green waves-effect">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <input type="file" hidden id="imgUser" onChange={this.changeFile}></input>
            </div>
        )
    }


}

export default AlumnoForm;