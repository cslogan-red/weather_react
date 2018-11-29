import React, { Component } from 'react';
import './HourlyOutlook.css';

class HourlyOutlook extends Component {

    // render implementation
    render() {

        const icon = this.props.icon,
              hour = this.props.hour,
              temp = this.props.temp;
        return(
            <div className="hourly__wrapper">
                <div className="hourly__container">
                    <div className="hourly__detail">
                        <img alt="weather-icon" src={icon}
                             height="40px" width="40px" />
                    </div>
                    <div className="hourly__detail">
                        <span>{hour}</span>
                    </div>
                    <div className="hourly__detail">
                        <span>{temp}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default HourlyOutlook;