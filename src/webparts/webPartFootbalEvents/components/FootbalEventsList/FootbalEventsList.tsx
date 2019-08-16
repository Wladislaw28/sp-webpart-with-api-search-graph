import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {IFootbalEventsListProps} from './IFootbalEventsListProps';
import {IFootbalEventsListState} from './IFootbalEventsListState';
import Slider from '../Slider/Slider';

import styles from '../WebPartFootbalEvents.module.scss';

export default class FootbalEventsList extends React.Component<IFootbalEventsListProps,IFootbalEventsListState> {

    public state = {
      compactEvents: []
    };


    public updateData(config: any) {
      this.setState(config);
    }

    private addEventOutlookCalendar(e: any, dateEvent: string, 
      strEvent: string, strLeague: string, strTime: string): void {
        e.preventDefault();
        const subject = strEvent;
  
        const body = {
          "contentType": "HTML",
          "content": strLeague
        };
  
        const start = {
          "dateTime": dateEvent + 'T' + strTime,
          "timeZone": "UTC"
        };
  
        const end = {
          "dateTime": dateEvent + 'T' + strTime,
          "timeZone": "UTC"
        };
  
      this.props.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
            client.api('/me/events').post({subject,body,start,end}, (error, res) => {
              if (error) {
                console.error(error);
                return;
              }
              alert("Event Added");
          });
      })
    }
  
    private async addEventListCalendar(e: any, dateEvent: string, strEvent: string, 
     strSport: string, strTime: string) : Promise<any> {

          e.preventDefault();
          const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
          let web = new Web1('https://mihasev28wmreply.sharepoint.com');

          web.lists.getById('30289322-d788-4219-9783-02a984721df8').items.add({
              Title: strEvent,
              profilename: this.props.userName,
              categorySport: strSport,
              //sports: strSport,
              EventDate: dateEvent + 'T' + strTime,
              EndDate: dateEvent + 'T' + strTime
          });

    }

    public render(): React.ReactElement<IFootbalEventsListProps> {
        return(
          <div>
            <Slider arrayEvents={this.props.arrayEvents} update={this.updateData.bind(this)} /> 
            <div className={styles.container_football}>
             {this.state.compactEvents.map((item) => {
               const re = /\s*\s*/;
               const refactTime = item.strTime.split(re).splice(0, 5).join('');
             return(
                 <div key={item.idEvent}  className={styles.container_football_event}>
                     <h1 className={styles.title_Event}>{item.strEvent}</h1>
                     <p className={styles.title_Date}>{item.strDate}</p>
                     <h2 className={styles.title_Time}>{refactTime}</h2>
                         <div>
                             <p className={styles.title_Team}>Home team: {item.strHomeTeam}</p>
                             <p className={styles.title_Team}>Away team: {item.strAwayTeam}</p>
                         </div>
                     <button onClick={(e) => {

                         this.addEventListCalendar(e,item.dateEvent, 
                         item.strEvent, item.strSport, item.strTime);

                         this.addEventOutlookCalendar(e,item.dateEvent, 
                         item.strEvent, item.strLeague, item.strTime); 

                     }}>Sign Up</button>
                 </div>
             );
             })}

          </div> 
      </div>
          
        );
    }
}