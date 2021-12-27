import React, { Component } from 'react';
import  DetailStudent from './detailStudent';

class ByName extends Component {

    state = {
        student:false
    }

    showDetail = (student) =>{
     this.setState({student});
    }

    render() {
        return (
            <div className="row">
                <div className="col s12 m6 l6 xl6">
                    <ul className="collection">
                        {
                            this.props.students.map((value, index) => {
                            return <li className="collection-item"
                                onClick={()=>this.showDetail(value)}
                            >{value.name}</li>
                            })
                        }
                    </ul>
                </div>

                {
                    this.state.student ? 
                    <DetailStudent student={this.state.student} />
                    : null
                }

            </div>
        )
    }
}

export default ByName;