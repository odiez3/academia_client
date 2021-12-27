import React, { Component } from 'react';
import { URL_API } from '../../properties';
import axios from 'axios';
import AdicionalForm from '../adicionalForm.cmpt';
import M from 'materialize-css';

class Adicionales extends Component {


    state = {
        extras: [],
        id: false,
        realoadExtras: false
    }

    componentDidMount() {
        debugger;
        if (this.props.student) {
            this.setState({ id: this.props.student._id }, () => {
                this.getExtras();
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.student || nextProps.reload) {
            this.setState({ id: nextProps.student._id }, () => {
                this.getExtras(this.state.id);
            })
        }
    }
    realoadExtras = () => {
        this.setState({ reload: true }, () => {
            this.getExtras();
        });
    }


    getExtras() {
        let { id } = this.state;
        debugger;
        if (id) {
            debugger;
            axios.post(`${URL_API}/getExtras`, { id }).then((response) => {
                if (response.data) {
                    this.setState({ extras: response.data });
                }
            });
        }
    }

    cancelExtra(id) {
        axios.post(`${URL_API}/cancelExtra`, { id }).then((response) => {
            M.toast({ html: `Concepto cancelado correctamente. <i class="material-icons">check</i>`, classes: "green" });
            this.getExtras();
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
        let { extras } = this.state;
        let { student } = this.props;
        return (
            <div className="row  mt-1">

                <React.Fragment>
                    <div className="row">
                        <div className="col s12">
                            <div className="divider"></div>
                        </div>
                        <div className="col s12">
                            <ul className="collection with-header">
                                <li className="collection-header"><h5>Adicionales</h5>
                                    <button type="button"
                                        className="btn green waves-effect w-100 modal-trigger" href="#adicionalForm">
                                        <i className="material-icons left">add_shopping_cart</i>Agregar Adicional
                                                </button>
                                </li>
                                <li className="collection-item">
                                    <span className="badge red lighten-3 white-text">Cancelado</span>
                                    <span className="badge green lighten-2 white-text">Pagado</span>
                                    Info:
                                                    </li>
                                {
                                    extras.map((value, index) => {
                                        return (
                                            <li className={`collection-item  ${value.finished ? "green lighten-2 white-text" : `${value.canceled ? "red lighten-3 white-text" : ""} `}`} key={index}>{value.concept}
                                                <a href="#!" className={`secondary-content ${value.finished ? "white-text" : `${value.canceled ? " white-text" : ""} `}`}>
                                                    ${parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)}
                                                    {!value.finished && !value.canceled ? `-(Pendiente ${value.remaining ?
                                                        `$${parseFloat(Math.round(value.remaining * 100) / 100).toFixed(2)}`
                                                        :
                                                        `$${parseFloat(Math.round(value.amount * 100) / 100).toFixed(2)}`
                                                        })` : null}

                                                    {!value.finished && !value.canceled ?
                                                        <i className="material-icons right red-text"
                                                            onClick={() => {
                                                                this.cancelExtra(value._id);
                                                            }}
                                                        >cancel</i>
                                                        : null}
                                                </a>
                                            </li>
                                        )
                                    })
                                }

                            </ul>
                        </div>

                    </div>

                </React.Fragment>

                <AdicionalForm student={student} reload={this.state.reload} reloadExtras={this.realoadExtras} />
            </div>
        )
    }

}

export default Adicionales;