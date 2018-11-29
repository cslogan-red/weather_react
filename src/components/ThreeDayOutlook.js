import React, { Component } from 'react';
import './ThreeDayOutlook.css';
import WeatherTile from './WeatherTile';

class ThreeDayOutlook extends Component {

    // render implementation
    render() {

        const outlook = this.props.outlook ? this.props.outlook : [],
               hourly = this.props.hourly ? this.props.hourly : [];
        return(
            <div>
                { outlook && outlook.length ? (
                    <div className="three-day__container">
                        <div className="three-day__header--label">
                            <span>Three Day Outlook</span>
                        </div>
                        <div className="three-day__tile--container">
                            {outlook.map( (conditions, i) => 
                                <WeatherTile conditions={conditions} hourly={hourly} key={i} />)}
                        </div>
                    </div>
                ) : ('') }
            </div>
        );
    }
}

export default ThreeDayOutlook;