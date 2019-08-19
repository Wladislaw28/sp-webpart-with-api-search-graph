import * as React from 'react';
import {IFootballEventsListProps} from './IFootballEventsListProps';
import {IFootballEventsListState} from './IFootballEventsListState';
import Slider from '../Slider/Slider';
import FootballEvent from './FootballEvent/FootballEvent';
import styles from '../WebPartFootbalEvents.module.scss';

export default class FootballEventsList extends React.Component<IFootballEventsListProps,IFootballEventsListState> {

    public state = {
      compactEvents: [],
      newItem: {}
    };

    public updateData(config: any) {
      this.setState(config);
      this.props.update({newItem: config.newItem});
    }

    public render(): React.ReactElement<IFootballEventsListProps> {
        return(
          <div>
            <Slider arrayEvents={this.props.arrayEvents} update={this.updateData.bind(this)} /> 

            <div className={styles.container_football}>
             {this.state.compactEvents.map((item) => {
               const re = /\s*\s*/;
               const refactTime = item.strTime.split(re).splice(0, 5).join('');
             return(
                 <div key={item.idEvent}  className={styles.container_football_event}>
                    <FootballEvent Event={item.strEvent} EventDate={item.dateEvent} EventDateForUI={item.strDate} refactTime={refactTime}
                     HomeTeam={item.strHomeTeam} AwayTeam={item.strAwayTeam} 
                     Sport={item.strSport} Time={item.strTime} League={item.strLeague}
                      username={this.props.userName} context={this.props.context} update={this.updateData.bind(this)}/>
                 </div>
             );
             })}
          </div> 

      </div>
      );
    }
}