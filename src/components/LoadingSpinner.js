import React, { Component } from 'react';
import './LoadingSpinner.css';

class LoadingSpinner extends Component {

    // render implementation
    render() {

        const showSpinner = this.props.showSpinner;
        return(
            <div>
                { showSpinner ? (
                    <span className="loading__spinner--container">
                        <div className="loading__spinner--spinner loading__spinner_rotate_01"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_02"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_03"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_04"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_05"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_06"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_07"></div>
                        <div className="loading__spinner--spinner loading__spinner_rotate_08"></div>
                    </span>
                 ) : ('') }
            </div>
        );
    }
}

export default LoadingSpinner;
