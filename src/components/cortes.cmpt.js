import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { URL_API, plantillaFecha } from '../properties';
import axios from 'axios';
import moment from 'moment';
import M from 'materialize-css';

class Cortes extends Component {


    state = {
        dates: [],
        resultados: [],
        ticketId: "",
        tipoBusqueda: "Ticket",
    }

    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'), {});
    }

    onChange = (date) => {
        console.log(date);
        this.setState({ dates: date, resultados: [] }, () => {
            this.getData();
        })
    }

    getData = () => {
        let { dates } = this.state;

        let data = {
            from: moment(moment(dates[0]).startOf('day')).format('YYYY-MM-DD HH:mm'),
            to: moment(moment(dates[1]).endOf('day')).format('YYYY-MM-DD HH:mm')
        }
        axios.post(`${URL_API}/getAllPaymentsCharges`, data).then((rs) => {
            console.log(rs);
            this.setState({ resultados: rs.data });
        }).catch((err) => {
            if (err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
            }
        })
    }

    descarga = () => {
 
        let { dates, resultados } = this.state;
        let from = dates[0].getFullYear() + "/" + (dates[0].getMonth() + 1) + "/" + dates[0].getDate();
        let to = dates[1].getFullYear() + "/" + (dates[1].getMonth() + 1) + "/" + dates[1].getDate();
        console.log(from);
        console.log(to);
        axios.post(`${URL_API}/pdfPaymentsCharges`, { data: resultados, from, to }, { responseType: 'blob' }).then((rs) => {
            console.log(rs);
            const url = window.URL.createObjectURL(new Blob([rs.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cortegenerado.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch((err) => {
            if (err.response && err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar los usuarios.", classes: "red white-text" });
            }
        })
    }

    render() {
        let { resultados } = this.state;
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
                            </div> : null
                    }

                    <div className="col s12 mt-1">
                        <Calendar
                            onChange={this.onChange}
                            returnValue={"range"}
                            selectRange={true}
                        />
                    </div>
                    <div className='col s12 divider mt-1'>

                    </div>
                </div>
                <div className='row'>
                    <div className='col s12'>
                        <h5>Buscar Ticket</h5>
                    </div>

                    <div className='col s3 left-align'>
                        <select onChange={(e) => {
                            this.setState({ tipoBusqueda: e.target.value, ticketsAlumno: false, tickets: false, ticketId: ""  });
                        }}>
                            <option value="Ticket">Por ticket</option>
                            <option value="Alumno">Por Alumno (ID)</option>
                        </select>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        if (this.state.tipoBusqueda === "Alumno") {
                            this.getTicketAlumno();
                        } else {
                            this.getTickets();
                        }

                    }} className='row'>
                        <div className='input-field col s12'>
                            <input type="text" id="ticketId" onChange={(e) => {
                                this.setState({ ticketId: e.target.value })
                            }} value={this.state.ticketId} />
                            <label htmlFor="ticketId">{this.state.tipoBusqueda}</label>
                        </div>
                    </form>
                    {
                        this.state.ticketsAlumno && this.state.ticketsAlumno.length ?
                            <div className='col s6'>
                                <ul className='collection'>
                                    {
                                        this.state.ticketsAlumno.map((t, index) => {
                                            return <li key={index} className='collection-item'
                                                onClick={() => {

                                                    this.findTicket(t.ticketId);

                                                }}

                                            >Fecha : {plantillaFecha(t.date)}<a href="#!" class="secondary-content">{t.ticketId} </a></li>
                                        })
                                    }
                                </ul>

                            </div>
                            : null
                    }

                    {
                        this.state.tickets && this.state.tickets.length ?
                            <div className={this.state.ticketsAlumno && this.state.ticketsAlumno.length ?
                                'col s6' : 'col s12'}>
                                <div className='row'>
                                    <div className='col s12'>
                                        <p>{this.state.tickets[0].student.nameUpper}</p>
                                        <p>Fecha : {plantillaFecha(this.state.tickets[0].date)}  </p>
                                    </div>
                                    <div className='col s12'>

                                        <table className='striped'>
                                            <thead>
                                                <tr>
                                                <th>Concepto</th>
                                                    <th>Monto</th>
                                                   
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    this.state.tickets.map((ticket, index) => {
                                                        
                                                        return (
                                                            <tr key={index}>

                                                                {
                                                                    ticket.isLesson ?
                                                                        <td>Clase</td> :
                                                                        <td>{ticket.concept.concept} (Extra)</td>

                                                                }
                                                                {
                                                                    ticket.isLesson ?
                                                                        <td>${parseFloat(Math.round(ticket.charge * 100) / 100).toFixed(2)}</td> :
                                                                        <td>${parseFloat(Math.round(ticket.payment * 100) / 100).toFixed(2)}</td>
                                                                }


                                                            </tr>
                                                        )
                                                    })
                                                }

                                                <tr>
                                                    <td className='right-align'><strong>Total:</strong></td>
                                                    <td><stron>{this.getTotal(this.state.tickets)}</stron></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        );
    }

    getTicketAlumno = () => {
        if (this.state.ticketId.trim() !== "") {
            axios.post(`${URL_API}/getTicketsAlumno`, { idAlumno: this.state.ticketId }).then((rs) => {
              
              if(rs.data && rs.data.length){
                 this.setState({ ticketsAlumno: rs.data });  
              }else{
                this.setState({ ticketsAlumno: false, tickets: false },()=>{
                    M.toast({ html: `Este alumno no cuenta con tickets`, classes: "red white-text" });
                });  
              }
               
            }).catch((err) => {
                if (err.response.data) {
                    M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
                } else {
                    M.toast({ html: "Ocurrio un error inesperado al consultar los tickets.", classes: "red white-text" });
                }
            })
        }
    }


    getTickets = () => {
        if (this.state.ticketId.trim() !== "") {

            this.findTicket(this.state.ticketId);
        }
    }

    findTicket = (ticket) => {
        axios.post(`${URL_API}/getTicket`, { ticketId: ticket }).then((rs) => {
            console.log(rs);
            this.setState({ tickets: rs.data });
        }).catch((err) => {
        
            if (err.response.data) {
                M.toast({ html: `${err.response.data.message}`, classes: "red white-text" });
            } else {
                M.toast({ html: "Ocurrio un error inesperado al consultar el ticket.", classes: "red white-text" });
            }
        })
    }

    getTotal(tickets){
        let total  = 0;

        tickets.forEach(t=>{
            if(t.isLesson){
                total += t.charge;
            }else{
                total += t.payment;
            }
        });

        return `$${parseFloat(Math.round(total * 100) / 100).toFixed(2)}`
    }
}

export default Cortes;