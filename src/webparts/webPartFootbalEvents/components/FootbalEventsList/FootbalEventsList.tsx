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

    private _sliceEvents( sign: string ): void {
      let counter = this.state.counter;
      if (sign === '+') {
        counter += 3;
      } else if ( sign === '-' ) {
        counter -= 3;
      } else {
        counter = 0;
      }
      const filterArray = this.props.arrayEvents.slice(counter, counter + 3);
      this.setState({
        compactEvents: filterArray,
        counter
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
              {this.state.counter > 0 ? 
               <button onClick={() => this._sliceEvents('-')}>Back</button> : null}
              {this.state.counter === 12 ? 
              null : <button onClick={() => this._sliceEvents('+')}>Next</button>}
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
                        <button onClick={(e) => {

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