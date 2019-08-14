import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {IFootbalEventsListProps} from './IFootbalEventsListProps';

import styles from '../WebPartFootbalEvents.module.scss';


export default class FootbalEventsList extends React.Component<IFootbalEventsListProps,{}> {

    private addEventOutlookCalendar(e: any, dateEvent: string, strEvent: string, strLeague: string): void {
        e.preventDefault();
        const subject = strEvent;
  
        const body = {
          "contentType": "HTML",
          "content": strLeague
        };
  
        const start = {
          "dateTime": dateEvent,
          "timeZone": "UTC"
        };
  
        const end = {
          "dateTime": dateEvent,
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
  
    private async addEventListCalendar(e: any, dateEvent: string, strEvent: string, strLeague: string, userName: string) : Promise<any> {
          e.preventDefault();
          
          // const re = /\s*\s*/;
          // let str1 = strDate.split(re);
          // [str1[0], str1[3]]  = [str1[3], str1[0]];
          // [str1[1], str1[4]] = [str1[4], str1[1]];
          // const dateStartEvent = str1.join('');
  
          const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
          let web = new Web1(this.props.context.pageContext.web.absoluteUrl + '/sites/Dev1');
          web.lists.getById('80fed460-d7c5-499e-920b-32db6689236e').items.add({
              Title: strEvent,
              NameUser: userName,
              EventDate: dateEvent,
              EndDate: dateEvent,
              CategoryFootball: strLeague
          });

    }

    public render(): React.ReactElement<IFootbalEventsListProps> {
        return(
            <div>
                {this.props.arrayEvents.map((item) => {
                return(
                    <div className={ styles.column } key={item.idEvent}>
                        <h1>{item.strEvent}</h1>
                        <h2>{item.dateEvent}</h2>
                            <div>
                                <p>Home team: {item.strHomeTeam}</p>
                                <p>Away team: {item.strAwayTeam}</p>
                            </div>
                        <button className={styles.button} 
                        onClick={(e) => {

                            this.addEventListCalendar(e,item.dateEvent, 
                            item.strEvent, item.strLeague, this.props.userName);

                            this.addEventOutlookCalendar(e,item.dateEvent, 
                            item.strEvent, item.strLeague); 

                        }}>Sign Up</button>
                    </div>
                );
                })}
          </div>
        )
    }
}