import React, { Component } from 'react';
import { URL_API, validateEmail } from '../properties';
import axios from 'axios';
import M from 'materialize-css';

class UsersApp extends Component {

    state = {
        users: [],
        current: false,
        errors: {},
        name: "",
        surname: "",
        password: "",
        email: "",
        role: "",
        id: false
    }



    changeValue = (event) => {
        let { value, id } = event.target;
        let { errors } = this.state;
        errors[id] = null;
        this.setState({ [id]: value, errors });
    }

    componentDidMount() {
        let user = localStorage.getItem('user');
        if (user) {
            console.log(user);
            this.setState({ current: JSON.parse(user) });
        }
        this.getUsers();
    }

    getUsers = () => {
        axios.get(`${URL_API}/getUsersApp`).then((rs) => {
          
            this.setState({ users: rs.data }, () => {
                M.FormSelect.init(document.querySelectorAll('select'), {});
            });
        }).catch((err) => {
            console.log(err);
            if (err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
            }
        })
    }

    render() {
        let { users, current, name, surname, email, password, role, errors, id } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 mt-1">
                        <h4>Usuarios</h4>
                    </div>
                    <div className="col s12">
                        <div className="divider"></div>
                    </div>
                    <div className="col s12 m6 l6 xl6">
                        {
                            users.length ?
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            users.map((value, index) => {

                                                return (<tr key={index}>
                                                    <td>
                                                        {value.name + " " + value.surname}
                                                    </td>
                                                    <td>
                                                        {value.email}
                                                    </td>
                                                    <td>
                                                        {value.role === "ROLE_ADMIN" ? "Administrador" : "Checador"}
                                                    </td>
                                                    <td>
                                                        <i className="material-icons green-text cursor_p waves-effect"
                                                            onClick={() => {
                                                                this.setState({
                                                                    name: value.name,
                                                                    surname: value.surname,
                                                                    email: value.email,
                                                                    role: value.role,
                                                                    id: value._id
                                                                }, () => {
                                                                    M.FormSelect.init(document.querySelectorAll('select'), {});
                                                                    M.updateTextFields();
                                                                })
                                                            }}
                                                        >edit</i>
                                                        {
                                                            current.email !== value.email ? <i className="material-icons red-text cursor_p waves-effect">delete_forever</i>
                                                                : null
                                                        }

                                                    </td>
                                                </tr>)

                                            })
                                        }
                                    </tbody>
                                </table>

                                : null
                        }
                    </div>
                    <div className="col s12 m6 l6 xl6">
                        <form className="row z-depth-2" onSubmit={this.submitUser}>
                            <div class="input-field col s6">
                                <input id="name" type="text"
                                    className={`${errors.name ? "invalid" : ""} `}
                                    onChange={this.changeValue} value={name}
                                />
                                <label htmlFor="name">Nombre</label>
                                <span className="helper-text" data-error={errors.name}></span>
                            </div>
                            <div class="input-field col s6">
                                <input id="surname" type="text"
                                    className={`${errors.surname ? "invalid" : ""} `}
                                    onChange={this.changeValue} value={surname}
                                />
                                <label htmlFor="surname">Apellidos</label>
                                <span className="helper-text" data-error={errors.surname}></span>
                            </div>
                            <div class="input-field col s12">
                                <input id="email" type="text"
                                    disabled={id}
                                    className={`${errors.email ? "invalid" : ""} `}
                                    onChange={this.changeValue} value={email}
                                />
                                <label htmlFor="email">Correo electrónico</label>
                                <span className="helper-text" data-error={errors.email}></span>
                            </div>
                            <div class="input-field col s12">
                                <input id="password" type="password"
                                    className={`${errors.password ? "invalid" : ""} `}
                                    onChange={this.changeValue} value={password}
                                />
                                <label htmlFor="password">Contraseña</label>
                                <span className="helper-text" data-error={errors.password}></span>
                            </div>
                            <div className="input-field col s12">
                                <select onChange={this.changeValue} id="role" value={role}
                                    className={`${errors.role ? "invalid" : ""} `}
                                >
                                    <option value="">Elije el Rol</option>
                                    <option value="ROLE_ADMIN">Administrador</option>
                                    <option value="ROLE_CHECK">Checador</option>
                                </select>
                                <label>Rol</label>
                                <span className="helper-text red-text" >{errors.role}</span>
                            </div>
                            <div className={`col ${id?`s6`:`s12`} center-align`}>
                                <button className="btn">Guardar</button>
                            </div>
                            {
                                id ?
                                    <div className={`col s6 center-align`}>
                                        <button className="btn red" type="button" onClick={() => {
                                            this.setState({
                                                name: "",
                                                surname: "",
                                                email: "",
                                                password: "",
                                                role: "",
                                                id: false
                                            },()=>{
                                                M.updateTextFields();
                                                M.FormSelect.init(document.querySelectorAll('select'), {});
                                            });
                                        }}>Cancelar</button>
                                    </div>
                                    : null
                            }

                            <div className="col s12 mt-1">

                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }

    submitUser = (event) => {
        event.preventDefault();
        let { name, surname, email, password, role, errors, id } = this.state;
        let valido = true;
        if (name.trim() === "") {
            errors.name = "Ingrese el nombre del usuarios.";
            valido = false;
        }

        if (surname.trim() === "") {
            errors.surname = "Ingrese los apellidos del usuario.";
            valido = false;
        }

        if (email.trim() === "") {
            errors.email = "Ingrese el correo electrónico.";
            valido = false;
        } else {
            if (!validateEmail(email.trim())) {
                errors.email = "Ingrese un correo electrónico válido.";
                valido = false;
            }
        }

        if (password.trim() === "") {
            errors.password = "Ingrese la contraseña del usuario.";
            valido = false;
        }

        if (role.trim() === "") {
            errors.role = "Seleccione el rol del usuario.";
            valido = false;
        }

        if (valido) {

            let url = `${URL_API}/register`;



            let data = {
                name: name.trim(),
                surname: surname.trim(),
                email: email.toLowerCase().trim(),
                password: password.trim(),
                rol: role
            }
        
            if (id) {
                url = `${URL_API}/update-user/${id}`;
            }

            axios.post(url, data).then(rs => {

                this.setState({
                    id: false,
                    name: "",
                    surname: "",
                    email: "",
                    password: "",
                    role: ""
                }, () => {
                    this.getUsers();
                    if (id) {
                        M.toast({ html: `Usuario actualizado exitosamente.`, classes: "green white-text" });
                    } else {
                        M.toast({ html: `Usuario registrado exitosamente.`, classes: "green white-text" });
                    }

                });

            }).catch((err) => {
                if (err.response.data) {
                    M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
                } else {
                    M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
                }
            });
        } else {
            this.setState({ errors });
        }
    }
}


export default UsersApp;