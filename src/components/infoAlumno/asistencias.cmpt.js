import React, { Component } from 'react';
import { URL_API } from '../../properties';
import axios from 'axios';
import moment from 'moment';
import M from 'materialize-css';
import Calendar from 'react-calendar';
class Asistencias extends Component {


    state = {
        from: "",
        to: "",
        asistencias: []
    }

    changeValues = (event) => {
        let { id, value } = event.target;
        console.log(value);
        this.setState({ [id]: value }, () => {
            this.getAsistencias();
        });
    }


    getAsistencias = () => {
  
        let { from, to } = this.state;
        let { student } = this.props;

        if (from.trim() !== "" && to.trim() !== "") {
          
            let data = {
                "id": student._id,
                "from": from,
                "to": to
            }
            console.log(data);
            console.log(JSON.stringify(data));

            axios.post(`${URL_API}/getAssitancesByID`, data).then((res) => {
                console.log(res.data.length);
                console.log(res.data)
                this.setState({ asistencias: res.data });
            }).catch((error) => {
                if (error.response) {
                    M.toast({ html: error.response.data.message, classes: "red" });
                }
            })
        }


    }

    render() {
        let { from, to, asistencias } = this.state;
        return (
            <div className="row z-depth-2 mt-1">
                <div className="col s12 mt-1">
                    <div className="row">
                        <div className="col s4">
                            <p>Pagada sin Asistencia <i className="material-icons yellow-text left">brightness_1</i></p>
                        </div>
                        <div className="col s4">
                            <p>Asistencia <i className="material-icons green-text left">brightness_1</i></p>
                        </div>
                        <div className="col s4">
                            <p>Asistencia por Pagar <i className="material-icons red-text left">brightness_1</i></p>
                        </div>
                    </div>
                </div>
                <div className="input-field col s6">
                    <input id="from" type="date" value={from}
                        onChange={this.changeValues}
                    />
                    <label htmlFor="from">Desde:</label>
                </div>
                <div className="input-field col s6">
                    <input id="to" type="date" value={to}
                        onChange={this.changeValues}
                    />
                    <label htmlFor="to">Hasta:</label>
                </div>

                <div className="col s12">
                    {
                        asistencias.length ?

                            <Calendar
                            activeStartDate={moment(moment(from).startOf('day')).toDate()}
                            defaultActiveStartDate={moment(moment(from).startOf('day')).toDate()}
                                tileClassName={({ activeStartDate, date, view }) => {
                                    if (view === "month") {
                                        for (var d of this.state.asistencias) {
                                            let f = new Date(d.assistence);

                                            if (f.getTime() === date.getTime()) {
                                                if (d.paidOut && d.assisted) {
                                                    return "green white-text"
                                                }

                                                if (d.paidOut && !d.assisted) {
                                                    return "yellow white-text"
                                                }

                                                if (!d.paidOut && d.assisted) {
                                                    return "red white-text"
                                                }

                                            }
                                        }
                                    }
                                }}
                            />

                            : null
                    }

                </div>

            </div>
        )
    }

}

export default Asistencias;