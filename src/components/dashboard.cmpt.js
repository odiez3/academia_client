import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'
import M from 'materialize-css';
import logo from '../assets/logoAcademia.jpg';



import BuscaAlumno from './buscaAlumno.cmpt';
import ListAlumnos from './listaAlumnos.cmpt';
import InfoAlumno from './informacionAlumno.cmpt';
import Abonos from './abonos.cmpt';
import UsersApp from './usersApp.cmpt';
import Cortes from './cortes.cmpt';
//import AbonoForm from './abonoForm.cmpt';
class Dashboard extends Component {

    state = {
        user: {}
    }

    componentDidMount = () => {
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {});
        let isLogin = localStorage.getItem('user');
        if (isLogin) {
            let user = JSON.parse(isLogin);
            this.setState({ user });
        }
    }

    render() {
        let { user } = this.state;
        let { match } = this.props;
        return (

            <React.Fragment>
                <nav className="grey darken-4">
                    <div className="nav-wrapper">
                        <Link to="/dashboard" className="brand-logo">
                            Administración
                        </Link>
                        <a href="!#" data-target="sidenav" className="right sidenav-trigger"><i className="material-icons">menu</i></a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            {
                                user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/usersApp`}>Administradores</Link></li> : null}
                            {
                                user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/alumnos`}>Alumnos</Link></li> : null}
                            {
                                user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/cortes`}>Cortes</Link></li> : null}
                            <li><a href="!#" onClick={() => {
                                localStorage.removeItem('user');
                                this.props.history.push('/');
                            }}>Salir</a></li>
                        </ul>
                    </div>
                </nav>

                <ul className="sidenav" id="sidenav">
                    <li><div className="user-view">
                        <div className="background">
                            <img src={logo} alt="back" />
                        </div>
                        <a href="#user"><img className="circle" src={logo} alt={user.rol}></img></a>
                        <a href="#name"><span className="white-text name">{user.name}</span></a>
                        <a href="#email"><span className="white-text email">{user.email}</span></a>

                    </div></li>
                    <li><div className="divider"></div></li>
                    {user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/usersApp`}>Administradores</Link></li> : null}
                    {user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/alumnos`}>Alumnos</Link></li> : null}
                    {user.rol === "ROLE_ADMIN" ? <li><Link to={`${match.path}/cortes`}>Cortes</Link></li> : null}
                    <li><a href="!#" onClick={() => {
                        localStorage.removeItem('user');
                        this.props.history.push('/');
                    }}>Salir</a></li>
                </ul>
                {user.role}

                <Switch>

                    {
                        user.rol === "ROLE_ADMIN" ?
                            <Route path="/dashboard/mas/:consecutivo" component={InfoAlumno} />
                            : null
                    }
                    {
                        user.rol === "ROLE_ADMIN" ?
                            <Route path="/dashboard/usersApp" component={UsersApp} />
                            : null
                    }
                    {
                        user.rol === "ROLE_ADMIN" ?
                            <Route path="/dashboard/abonos/:consecutivo" component={Abonos} />
                            : null
                    }
                    {
                        user.rol === "ROLE_ADMIN" ?
                            <Route path="/dashboard/alumnos" component={ListAlumnos} />
                            : null
                    }

                    {
                        user.rol === "ROLE_ADMIN" ?
                            <Route path="/dashboard/cortes" component={Cortes} />
                            : null
                    }
                    <Route path="/dashboard" component={BuscaAlumno} />

                </Switch>
            </React.Fragment>
        )
    }
}


export default Dashboard;