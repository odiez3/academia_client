import React, { Component } from 'react';
import Calendar from 'react-calendar';
import {URL_API} from '../properties';
import axios from 'axios';
import M from 'materialize-css';
class Cortes extends Component {


    state = {
        dates : [],
        resultados:[]
    }

    onChange = (date) =>{
        console.log(date);
        this.setState({ dates:date,resultados:[] },()=>{
            this.getData();
        })
    }

    getData = () =>{
        let {dates} = this.state;

        let data ={
            from: dates[0],
            to:dates[1]
        }
        axios.post(`${URL_API}/getAllPaymentsCharges`,data).then((rs)=>{
            console.log(rs);
            this.setState({resultados:rs.data});
        }).catch((err)=>{
            if (err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
            }
        })
    }

    descarga = () =>{
        let {dates,resultados} = this.state;
        let from = dates[0].getFullYear() + "/"+(dates[0].getMonth()+1)+"/"+dates[0].getDate();
        let to = dates[1].getFullYear() + "/"+(dates[1].getMonth()+1)+"/"+dates[1].getDate();
        console.log(from);
        console.log(to);
        axios.post(`${URL_API}/pdfPaymentsCharges`,{data:resultados,from,to},{responseType:'blob'}).then((rs)=>{
            console.log(rs);
            const url = window.URL.createObjectURL(new Blob([rs.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cortegenerado.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch((err)=>{
            debugger;
            if (err.response && err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
            }
        })
    }

    render() {
        let {resultados} = this.state;
        return (
            <div className="container">
                <div className="row mt-1">
                    <div className="col s12">
                        <h5>Cortes de Caja</h5>
                    </div>
                    <div className="col s12">
                        <div className="divider"></div>
                    </div>
                    <div className="col s12">
                        <span className="helper-text">
                            Selecciona un rango de fechas para obtener el resultado
                            de abonos.
                            </span>
                    </div>
                    {
                        resultados.length ? 
                        <div className="col s12 mt-1">
                            <button className="btn" onClick={this.descarga}>Descargar Resultados</button>
                        </div>: null
                    }

                    <div className="col s12 mt-1">
                        <Calendar 
                         onChange={this.onChange}
                         returnValue={"range"}
                         selectRange={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Cortes;