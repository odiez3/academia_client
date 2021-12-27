import React, { Component } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import { URL_API } from '../properties';
import logo from '../assets/logoAcademia.jpg'

class Login extends Component {

    state = {
        email: "",
        password: "",
        errors: {
        }
    }

    componentWillMount(){
        let user = localStorage.getItem('user');
        if(user){
            this.props.history.push('/dashboard');
        }
    }

    submit = (event) => {
        event.preventDefault();
        let {email,password,errors} = this.state;
        let valido  = true;
        if(email.trim() === ""){
            errors.email = "Ingrese un correo electrónico.";
            valido = false;
        }

        if(password.trim() === ""){
            errors.password = "Ingrese su contraseña.";
            valido = false;
        }

        if(valido){
            axios.post(`${URL_API}/login`,{email,password,gethash:true}).then((result)=>{
                localStorage.setItem('user',JSON.stringify(result.data));
                this.props.history.push('/dashboard');
            }).catch((error)=>{
                if(error.response){
                    let {data} = error.response;

                    if(data.message){
                        M.toast({html: data.message,classes: 'red'})
                    }
                }
            });
        }else{
            this.setState({errors});
        }
    }

    changeValue = (event) => {
        let { value, id } = event.target;
        let { errors } = this.state;
        errors[id] = null;
        this.setState({ [id]: value, errors });
    }
    render() {
        let { email, password, errors } = this.state;

        return (
            <div className=" loginContainer container valign-wrapper">
                <form className="row z-depth-2 " onSubmit={this.submit}>
                    <div className="col s12 center-align">
                        <img src={logo} className="responsive-img logo circle z-depth-2" alt="login" />
                    </div>
                    <div className="col s12">
                        <h4 className="title">Iniciar Sesión</h4>
                    </div>
                    <div className="input-field col s12">
                        <input id="email" type="text" value={email} class={
                            ` ${errors.email ? "invalid" : ""} `
                        }
                            onChange={this.changeValue} />
                        <label htmlFor="email">Correo eléctronico:</label>
                        <span className="helper-text" data-error={`${errors.email ? errors.email : ""}`}></span>
                    </div>
                    <div className="input-field col s12">
                        <input id="password" type="password" value={password} class={
                            ` ${errors.password ? "invalid" : ""} `
                        }
                            onChange={this.changeValue} />
                        <label htmlFor="password">Contraseña:</label>
                        <span className="helper-text" data-error={`${errors.password ? errors.password : ""}`}></span>
                    </div>
                    <div className="input-field col s12 center-align">
                        <button className="btn waves-effect yellow darken-1 btn-large">
                            <i className="material-icons right">send</i>Entrar
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;