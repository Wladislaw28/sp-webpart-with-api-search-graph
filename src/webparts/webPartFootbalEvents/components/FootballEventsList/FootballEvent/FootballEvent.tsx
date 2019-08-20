import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import {IFootballEventProps} from './IFootballEventProps';
import {urlTenant, idListCalendar} from '../../constans';
import {setLocalStorage} from '../../setLocalStorage';
import * as strings from 'WebPartFootbalEventsWebPartStrings';

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

    private choiceAddItem(Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string): void {
        if(nameTitleButton === 'Interesting'){
            this.addEventListCalendarOnline(EventDate,Event, Sport, Time);
        } else {
            this.addEventListCalendarOnline(EventDate,Event, Sport, Time);
            this.addEventOutlookCalendar(EventDate,Event, League, Time); 
        }
    }

    private onCheckItem(Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string ): void {
        this.setState({
            isStatusButton: !this.state.isStatusButton
        }, () => this.checkItem(this.state.isStatusButton, Event, nameTitleButton, EventDate, League, Time, Sport));
     }

     private checkItem(isStatusButton: boolean, Event: string, nameTitleButton: string, EventDate: string, 
        League: string, Time: string, Sport: string ): void {
            const json: string | null  = localStorage.getItem("arrayItemsListCalendar");
            const arrayListCalendar = JSON.parse(json);
            debugger;
            const itemSelected = arrayListCalendar.array.find((item) => {
                return item.Title === Event && item.profilename === this.props.username;
            });
            
            if(isStatusButton === true) { //add item + check
                if(itemSelected !== undefined) {
                    const idItem: string | null = itemSelected.IdItem;
                    const indexItem: string | null = arrayListCalendar.array.findIndex((item) => item.IdItem === idItem);
                    
                    this.removeItemInListCalendarOnline(idItem);
                    this.removeItemInListCalendar(indexItem);
                    this.choiceAddItem(Event, nameTitleButton, EventDate, League, Time, Sport);
                } else {
                    this.choiceAddItem(Event, nameTitleButton, EventDate, League, Time, Sport);
                }
            } else { //delete item
                const idItem: string | null = itemSelected.IdItem;
                const indexItem: string | null = arrayListCalendar.array.findIndex((item) => item.IdItem === idItem);
                this.removeItemInListCalendarOnline(idItem);
                this.removeItemInListCalendar(indexItem);
            }
        // arrayListCalendar.array.map((item,index) => {
        //         if(item.Title === Event && item.profilename === this.props.username ) {
        //             this.removeItemInListCalendarOnline(item.IdItem);
        //             this.removeItemInListCalendar(index);
        //             if(isStatusButton === true) {
        //                 this.choiceAddItem(Event, nameTitleButton, EventDate, League, Time, Sport);
        //             }
        //         }
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

    private async addEventListCalendarOnline(EventDate: string, Event: string, 
        Sport: string, Time: string) : Promise<any> {
             const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
             let web = new Web1(urlTenant);
             let newItem = {
                Title: Event,
                profilename: this.props.username,
                categorySport: Sport,
                EventDate: EventDate + 'T' + Time,
                EndDate: EventDate + 'T' + Time
                //ListItemID: +(Math.floor(Math.random() * (250 - 50 + 1)) + 50)
            };
            web.lists.getById(idListCalendar).items.add(newItem);
            this.addEventListCalendar(newItem);
       }

    private addEventListCalendar(newItem: object) : void {
        const json: string | null  = localStorage.getItem("arrayItemsListCalendar");
        const arrayListCalendar = JSON.parse(json);

        arrayListCalendar.array.push(newItem);

        setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');
        this.props.update({newItem: arrayListCalendar.array});
    }

    public render(): React.ReactElement<IFootballEventProps> {
        const {Event, EventDate, EventDateForUI, refactTime, HomeTeam, AwayTeam, Sport, Time, League} = this.props;
        return(
            <div>
                <h1 className={styles.title_Event}>{Event}</h1>
                     <p className={styles.title_Date}>{EventDateForUI}</p>
                     <h2 className={styles.title_Time}>{refactTime}</h2>
                         <div>
                             <p className={styles.title_Team}>{strings.HomeTeam} {HomeTeam}</p>
                             <p className={styles.title_Team}>{strings.AwayTeam} {AwayTeam}</p>
                         </div>

                     <a className={styles.button} onClick={() => {
                         this.onCheckItem(Event,'go', EventDate, League, Time, Sport);
                     }}>{this.state.isStatusButton === false ? strings.TextButtonLetsGo : strings.TextButtonNoLetsGo}</a>

                     <a className={styles.button} onClick={() => {
                         this.onCheckItem(Event,'Interesting', EventDate, League, Time, Sport);
                     }}>{this.state.isStatusButton === false ? strings.TextButtonIntresting : strings.TextButtonNoIntresting}</a>
            </div>
        );
    }
}

