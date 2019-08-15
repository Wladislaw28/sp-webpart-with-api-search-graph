import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {IFootbalEventsListProps} from './IFootbalEventsListProps';
import {Events} from '../IWebPartFootbalEventsState';
import styles from '../WebPartFootbalEvents.module.scss';

export interface IFootbalEventsListState {
  counter: number;
  compactEvents: Events[];
}

export default class FootbalEventsList extends React.Component<IFootbalEventsListProps,IFootbalEventsListState> {

    public state = {
      counter: 0,
      compactEvents: []
    };

    public componentDidMount(): void {
      this._sliceEvents('');
    }

    private _sliceEvents(sign:string): void {
      let counter = this.state.counter;
      let count:number;
      if (sign==='+') {
        count=1;
        counter += 3;
      } else if (sign==='-'){
        count=-1;
        counter -= 3;
      } else {
        count=1;
        counter = 0;
      }
      const filterArray = this.props.arrayEvents.slice(counter, counter + 3 * count);
      this.setState({
        compactEvents: filterArray
      });
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
      strLeague: string, userName: string, strSport: string, strTime: string) : Promise<any> {

          e.preventDefault();
          const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
          let web = new Web1(this.props.context.pageContext.web.absoluteUrl + '/sites/Dev1');

          web.lists.getById('80fed460-d7c5-499e-920b-32db6689236e').items.add({
              Title: strEvent,
              NameUser: userName,
              EventDate: dateEvent + 'T' + strTime,
              EndDate: dateEvent + 'T' + strTime,
              //CategoryFootball: strLeague,
              Category: strSport
          });

    }

    public render(): React.ReactElement<IFootbalEventsListProps> {
        return(
          <div>
            <div>
              {this.state.counter > 0 ?  <button className={styles.button} onClick={(e) => this._sliceEvents('-')}>Back</button> : null}
              {this.state.counter === 20 ? null : <button className={styles.button} onClick={(e) => this._sliceEvents('+')}>Next</button>}
            </div>
              <div>
                {this.state.compactEvents.map((item) => {
                  const re = /\s*\s*/;
                  const refactTime = item.strTime.split(re).splice(0, 5).join('');
                return(
                    <div key={item.idEvent}>
                        <h1>{item.strEvent}</h1>
                        <h2>{item.strDate}</h2>
                        <p>{refactTime}</p>
                            <div>
                                <p>Home team: {item.strHomeTeam}</p>
                                <p>Away team: {item.strAwayTeam}</p>
                            </div>
                        <button className={styles.button} 
                        onClick={(e) => {

                            this.addEventListCalendar(e,item.dateEvent, 
                            item.strEvent, item.strLeague, item.strSport, this.props.userName, item.strTime);

                            this.addEventOutlookCalendar(e,item.dateEvent, 
                            item.strEvent, item.strLeague, item.strTime); 

                        }}>Sign Up</button>
                    </div>
                );
                })}
            </div>
          </div> 
        )
    }
}