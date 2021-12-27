import React, { Component } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import { URL_API } from '../properties';

class AdicionalForm extends Component {

    state = {
        concepto: "",
        monto: "",
        errors: {},
        formAdicional: false,
        extras: []
    }


    componentDidMount() {
        var elems = document.getElementById('adicionalForm');
        let formAdicional = M.Modal.init(elems, {});

        this.setState({ formAdicional });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.student || nextProps.reload) {
            this.getExtras(nextProps.student._id);
        }

      
    }

    getExtras = (id) =>{
     
        axios.post(`${URL_API}/getExtras`, { id}).then((response) => {
       
            if (response.data) {
                this.setState({ extras: response.data });
            }
        });
    }

    submitAdicional = (event) => {
        event.preventDefault();
        let { concepto, monto, errors } = this.state;
        let valido = true;
        if (concepto.trim() === "") {
            valido = false;
            errors.concepto = "Ingrese el concepto de pago.";
        }

        debugger;
        if(!isNaN(monto)){

     

        if (monto.trim() === "") {
            valido = false;
            errors.monto = "Ingrese el monto del concepto.";
        }

        if (valido) {
          
            let data = {
                id: this.props.student._id,
                monto,
                concepto
            };

            axios.post(`${URL_API}/addExtra`, data).then((response) => {
     
                console.log(response.data);
                this.setState({ monto: "", concepto: "" }, () => {
                    this.getExtras(this.props.student._id);
                    this.props.reloadExtras();
                    M.toast({ html: `${response.data.message} <i class="material-icons">check</i>`, classes: "green" });
                });
            }).catch((error) => {
          
                if (error.response) {
                    let { message } = error.response.data;
                    M.toast({ html: message, classes: "red" });
                }
            });
        } else {
            this.setState({ errors });
        }

    }else{
        M.toast({ html: `Indique un monto válido.`, classes: "red" });
    }
    }

    changeValue = (event) => {
        let { id, value } = event.target;
        let { errors } = this.state;
        errors[id] = null;

        this.setState({ [id]: value, errors });
    }

    render() {
        let { monto, concepto, errors, extras } = this.state;
        return (
            <div id="adicionalForm" className="modal">
                <div className="modal-content">
                    <div className="row z-depth-2">
                        <form className="col s12" onSubmit={this.submitAdicional}>
                            <div className="row">
                                <div className="col s12">
                                    <h6><i className="material-icons left">add_shopping_cart</i>Agregar Adicional</h6>
                                </div>
                                <div className="col s12">
                                    <div className="divider"></div>
                                </div>
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="concepto" type="text"
                                        value={concepto}
                                        onChange={this.changeValue}
                                        className={`${errors.concepto ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="concepto">Concepto:</label>
                                    <span className="helper-text" data-error={errors.concepto}></span>
                                </div>
                                <div className="input-field col s12 m6 l6 xl6">
                                    <input id="monto" type="text"
                                        value={monto}
                                        onChange={this.changeValue}
                                        className={`${errors.monto ? "invalid" : ""} `}
                                    />
                                    <label htmlFor="monto">Monto:</label>
                                    <span className="helper-text" data-error={errors.monto}></span>
                                </div>
                            </div>
                            <div className="row">

                                <div className="col s12 center-align mt-1">
                                    <button className="btn waves-effect">Guardar</button>
                                </div>

                            </div>
                            {
                                extras.length  ?
                                    <React.Fragment>
                                        <div className="row">
                                            <div className="col s12">
                                                <div className="divider"></div>
                                            </div>
                                            <div className="col s12">
                                                <ul className="collection with-header">
                                                    <li className="collection-header"><h5>Pagos Adicionales</h5>
                                                    </li>
                                                    <li className="collection-item">
                                                    <span className="badge red lighten-3 white-text">Cancelado</span>
                                                    <span className="badge green lighten-2 white-text">Pagado</span>
                                                    Info:
                                                    </li>
                                                    {
                                                        extras.map((value, index) => {
                                                            return (
                                                                <li  className={`collection-item  ${value.finished ? "green lighten-2" : `${value.canceled ? "red lighten-3 white-text" : ""} `  }`} key={index}>{value.concept}
                                                                    <a href="#!"className={`secondary-content ${value.finished ? "black-text" : `${value.canceled ? " white-text" : ""} ` }`}>
                                                                        ${parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)}
                                                                {!value.finished ? `-(Pendiente ${value.remaining ?
                                                                        `$${parseFloat(Math.round(value.remaining * 100) / 100).toFixed(2)}`
                                                                        :
                                                                        `$${parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)}`
                                                                    })`: null}
                                                                    </a>
                                                                </li>
                                                            )
                                                        })
                                                    }

                                                </ul>
                                            </div>

                                        </div>

                                    </React.Fragment>
                                    : null
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdicionalForm;