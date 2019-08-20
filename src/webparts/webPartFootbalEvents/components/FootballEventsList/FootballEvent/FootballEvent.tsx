import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import {IFootballEventProps} from './IFootballEventProps';
import {urlTenant, idListCalendar} from '../../constans';
import {setLocalStorage} from '../../setLocalStorage';

import styles from '../../WebPartFootbalEvents.module.scss';

export default class FootballEvent extends React.Component<IFootballEventProps,{}> {

    public state = {
        isStatusButton: false
    };

    private async removeItemInListCalendarOnline(id: string): Promise<any> {
        const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
        let web = new Web1(urlTenant);
        let list = web.lists.getById(idListCalendar);
        list.items.getById(+id).delete();
    }

    private removeItemInListCalendar(id: string): void {
        const json: string | null  = localStorage.getItem("arrayItemsListCalendar");
        const arrayListCalendar = JSON.parse(json);

        arrayListCalendar.array.splice(id, 1);   
        setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');
        this.props.update({newItem: arrayListCalendar.array});
    }

    private choiceAddItem(isStatusButton: boolean, Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string): void {
        if(nameTitleButton === 'Interesting'){
            this.addEventListCalendar(EventDate,Event, Sport, Time);
        } else {
            this.addEventListCalendar(EventDate, 
                                    Event, Sport, Time);
            this.addEventOutlookCalendar(EventDate, 
                                    Event, League, Time); 
        }
    }

    private onCheckItem(Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string ): void {
        this.setState({
            isStatusButton: !this.state.isStatusButton
        }, () => this.checkItem(this.state.isStatusButton, Event, nameTitleButton, EventDate, League, Time, Sport));
     }

     private checkItem(isStatusButton: boolean, Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string ): void {
        const json: string | null  = localStorage.getItem("arrayItemsListCalendar");
        const arrayListCalendar = JSON.parse(json);
        arrayListCalendar.array.map((item,index) => {
                if(item.Title === Event && item.profilename === this.props.username ) {
                    this.removeItemInListCalendarOnline(item.IdItem);
                    this.removeItemInListCalendar(index);
                    //this.choiceAddItem(isStatusButton, Event, nameTitleButton, EventDate, League, Time, Sport);
                }
        });




            // arrayListCalendar.array.map((item,index) => {
            //     if(item.Title === Event && item.profilename === this.props.username ){
            //         if(isStatusButton === true) {
            //             arrayListCalendar.array.splice(index, 1);   
            //             setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');

            //             if(nameTitleButton === 'Interesting'){
            //                 this.addEventListCalendar(EventDate, 
            //                     Event, Sport, Time);
            //                     return;
            //             } else {
            //                 this.addEventListCalendar(EventDate, 
            //                     Event, Sport, Time);
            //                 this.addEventOutlookCalendar(EventDate, 
            //                     Event, League, Time); 
            //                     return;
            //             }
            //         } else {
            //             arrayListCalendar.array.splice(index, 1);   
            //             setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');
            //         }
            //     } else {
            //         if(isStatusButton === true){
            //             if(nameTitleButton === 'Interesting'){
            //                 this.addEventListCalendar(EventDate, 
            //                     Event, Sport, Time);
            //                     return;
            //             } else {
            //                 this.addEventListCalendar(EventDate, 
            //                     Event, Sport, Time);
            //                 this.addEventOutlookCalendar(EventDate, 
            //                     Event, League, Time); 
            //                     return;
            //             }
            //         }
            //     }
            // });
     }


    private addEventOutlookCalendar(EventDate: string, 
        Event: string, League: string, Time: string): void {
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
    
        this.props.context.getClient().then((client: MSGraphClient): void => {
              client.api('/me/events').post({subject,body,start,end}, (error, res) => {
                if (error) {
                  console.error(error);
                  return;
                }
                alert("Event Added");
            });
        });
      }

    private async addEventListCalendar(EventDate: string, Event: string, 
        Sport: string, Time: string) : Promise<any> {
             const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
             let web = new Web1(urlTenant);
             let newItem = {
                Title: Event,
                profilename: this.props.username,
                categorySport: Sport,
                EventDate: EventDate + 'T' + Time,
                EndDate: EventDate + 'T' + Time
            };
            web.lists.getById(idListCalendar).items.add(newItem);
            web.lists.getById(idListCalendar).items.getById(1).delete();
            this.props.update({newItem: newItem});
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
                         this.onCheckItem(Event,'go', EventDate, League, Time, Sport);
                     }}>Let's go</a>

                     <a className={styles.button} onClick={(e) => {
                         this.onCheckItem(Event,'Interesting', EventDate, League, Time, Sport);
                     }}>Interesting</a>

                    <a className={styles.button} onClick={(e) => {
                         this.addEventListCalendar(EventDate, Event, Sport, Time);
                     }}>Test</a>
            </div>
        );
    }
}

