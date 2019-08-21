import * as React from 'react';
import { IFootballEventProps } from './IFootballEventProps';
import { urlTenant, idListCalendar } from '../../constans';
import { setLocalStorage } from '../../setLocalStorage';
import { addEventOutlookCalendar } from './AddItem/addEventOutlookCalendar';
import { removeItemInListCalendar } from './RemoveItem/removeItemInListCalendar';
import { removeItemInListCalendarOnline } from './RemoveItem/removeItemInListCalendarOnline';
import { addEventListCalendarOnline } from './AddItem/addEventListCalendarOnline';
import * as strings from 'WebPartFootbalEventsWebPartStrings';

import styles from '../../WebPartFootbalEvents.module.scss';

export default class FootballEvent extends React.Component<IFootballEventProps, {}> {

    public state = {
        isStatusButton: false,
        statusButtonIntresting: false,
        statusButtonWillGo: false
    };

    public componentWillMount(): void {
        if (localStorage.getItem("arrayItemsListCalendar") !== null) {
            this.getStatusButton();
        }
    }

    private getStatusButton(): void {
        const json: string | null = localStorage.getItem("arrayItemsListCalendar");
        const arrayListCalendar = JSON.parse(json);

        const indexEvent = arrayListCalendar.array.findIndex((item) => item.Title === this.props.Event
            && item.profilename === this.props.username);

        if (indexEvent !== -1) {
            const statusBtn = arrayListCalendar.array[`${indexEvent}`].idEventCaml;
            if (statusBtn === '2') { //Intresting
                this.setState({
                    statusButtonIntresting: true
                });
            } else { //statusBtn === 3 - Пойду 
                this.setState({
                    statusButtonIntresting: true,
                    statusButtonWillGo: true,
                    isStatusButton: true
                });
            }
        }
    }

    private onCheckItem(Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string): void {
        this.setState({
            isStatusButton: !this.state.isStatusButton
        }, () => this.checkItem(this.state.isStatusButton, Event, nameTitleButton, EventDate, League, Time, Sport));
    }

    private checkItem(isStatusButton: boolean, Event: string, nameTitleButton: string, EventDate: string,
        League: string, Time: string, Sport: string): void {
        const json: string | null = localStorage.getItem("arrayItemsListCalendar");
        const arrayListCalendar = JSON.parse(json);

        const indexItem = arrayListCalendar.array.findIndex((item) =>
            item.Title === Event && item.profilename === this.props.username);

        if (isStatusButton === true) {
            if (indexItem !== -1) {
                this.findIdRemoveItemCaml(Event, this.props.username);
                removeItemInListCalendar(indexItem, this.props.update);
                this.choiceAddItem(Event, nameTitleButton, EventDate, League, Time, Sport);
            } else {
                this.choiceAddItem(Event, nameTitleButton, EventDate, League, Time, Sport);
            }
        } else {
            this.choiceRemoveButton(nameTitleButton, Event, indexItem, this.props.username, this.props.update);
        }
    }

    private choiceRemoveButton(nameTitleButton: string, Event: string, indexItem: string, username: string, update: (any)=> any ): void {
        this.findIdRemoveItemCaml(Event, username);
        removeItemInListCalendar(indexItem, update);
        if (nameTitleButton === 'Interesting') {
            this.setState({
                statusButtonIntresting: false
            });
        } else {
            this.setState({
                statusButtonIntresting: false,
                statusButtonWillGo: false,
                isStatusButton: false
            });
        }
    }

    private choiceAddItem(Event: string, nameTitleButton: string, EventDate: string, League: string, Time: string, Sport: string): void {
        if (nameTitleButton === 'Interesting') {
            addEventListCalendarOnline(EventDate, Event, Sport, Time, '2', this.props.username, this.props.update);
            this.setState({
                statusButtonIntresting: true
            });
        } else {
            addEventListCalendarOnline(EventDate, Event, Sport, Time, '3', this.props.username, this.props.update);
            addEventOutlookCalendar(EventDate, Event, League, Time, this.props.context);
            this.setState({
                statusButtonIntresting: true,
                statusButtonWillGo: true,
                isStatusButton: true
            });
        }
    }

    private async findIdRemoveItemCaml(Event: string, username: string) {
        const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
        let web = new Web1(urlTenant);
        const xml = `<View><Query><Where><And><Eq><FieldRef Name='profilename'/><Value Type='Text'>${username}</Value></Eq><Eq><FieldRef Name='Title'/><Value Type='Text'>${Event}</Value></Eq></And></Where></Query></View>`;
        web.lists.getById(idListCalendar).getItemsByCAMLQuery({ 'ViewXml': xml }).then((res) => {
            removeItemInListCalendarOnline(res['0'].Id);
        });
    }

    public render(): React.ReactElement<IFootballEventProps> {
        const { Event, EventDate, EventDateForUI, refactTime, HomeTeam, AwayTeam, Sport, Time, League } = this.props;
        return (
            <div>
                <h1 className={styles.title_Event}>{Event}</h1>
                <p className={styles.title_Date}>{EventDateForUI}</p>
                <h2 className={styles.title_Time}>{refactTime}</h2>
                <div>
                    <p className={styles.title_Team}>{strings.HomeTeam} {HomeTeam}</p>
                    <p className={styles.title_Team}>{strings.AwayTeam} {AwayTeam}</p>
                </div>

                <a className={styles.button} onClick={() => {
                    this.onCheckItem(Event, 'go', EventDate, League, Time, Sport);
                }}>{this.state.statusButtonWillGo === false ? strings.TextButtonLetsGo : strings.TextButtonNoLetsGo}</a>

                <a className={styles.button} onClick={() => {
                    this.onCheckItem(Event, 'Interesting', EventDate, League, Time, Sport);
                }}>{this.state.statusButtonIntresting === false ? strings.TextButtonIntresting : strings.TextButtonNoIntresting}</a>
            </div>
        );
    }
}

