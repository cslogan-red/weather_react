import React, { Component } from 'react';
import './CurrentConditions.css';
import WeatherTile from './WeatherTile';

class CurrentConditions extends Component {

    // render implementation
    render() {
        
        const location = this.props.location,
              rightNow = this.props.rightNow,
          locationName = this.props.locationName,
                hourly = this.props.hourly,
         hourlyHandler = this.props.onClick,
     currentConditions = this.props.current;
        return(
            <div>
                { location ? (
                    <div className="current__container">
                        <div className="current__header--label">
                            <span>{locationName}</span>
                        </div>
                        <div className="current__rightNow--label">
                            <span>Currently {rightNow}</span>
                        </div>
                        <div className="current__tile--container">
                            <WeatherTile 
                                isCurrent={true}
                                conditions={currentConditions}
                                hourly={hourly}
                                onClick={hourlyHandler} />
                        </div>
                    </div>
                ) : ('')}
            </div>
        );
    }
}

export default CurrentConditions;