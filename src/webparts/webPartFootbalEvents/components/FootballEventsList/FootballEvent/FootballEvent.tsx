import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {IFootballEventProps} from './IFootballEventProps';

import styles from '../../WebPartFootbalEvents.module.scss';

export default class FootballEvent extends React.Component<IFootballEventProps,{}> {

    private addEventOutlookCalendar(e: any, EventDate: string, 
        Event: string, League: string, Time: string): void {
          e.preventDefault();

          const subject = Event;
          const body = {
            "contentType": "HTML",
            "content": League
          };
    
          const start = {
            "dateTime": EventDate + 'T' + Time,
            "timeZone": "UTC"
          };
    
          const end = {
            "dateTime": EventDate + 'T' + Time,
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
        });
      }

    private async addEventListCalendar(e: any, EventDate: string, Event: string, 
        Sport: string, Time: string) : Promise<any> {
             e.preventDefault();

             const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
             let web = new Web1('https://mihasev28wmreply.sharepoint.com');
   
             web.lists.getById('30289322-d788-4219-9783-02a984721df8').items.add({
                 Title: Event,
                 profilename: this.props.username,
                 categorySport: Sport,
                 //sports: strSport,
                 EventDate: EventDate + 'T' + Time,
                 EndDate: EventDate + 'T' + Time
             });
       }

    public render(): React.ReactElement<IFootballEventProps> {
        const {Event, EventDate, EventDateForUI, refactTime, HomeTeam, AwayTeam, Sport, Time, League} = this.props;
        return(
            <div>
                <h1 className={styles.title_Event}>{Event}</h1>
                     <p className={styles.title_Date}>{EventDateForUI}</p>
                     <h2 className={styles.title_Time}>{refactTime}</h2>
                         <div>
                             <p className={styles.title_Team}>Home team: {HomeTeam}</p>
                             <p className={styles.title_Team}>Away team: {AwayTeam}</p>
                         </div>
                     <a className={styles.button} onClick={(e) => {
                         this.addEventListCalendar(e, EventDate, 
                            Event, Sport, Time);

                         this.addEventOutlookCalendar(e, EventDate, 
                            Event, League, Time); 
                     }}>Sign Up</a>
            </div>
        );
    }
}

