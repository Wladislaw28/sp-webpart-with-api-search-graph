import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { IWebPartFootbalEventsProps } from './IWebPartFootbalEventsProps';
import { IWebPartFootbalEventsState, Events } from './IWebPartFootbalEventsState';
import FootballEventsList from './FootballEventsList/FootballEventsList';
import ItemsListCalendar from './ItemsListCalendar/ItemsListCalendar';
import {
  urlApi, idListCalendar, titleListCalendar,
  urlTenant, minut15, arrayItemsListCalendar, arrayEventsApi
} from './constans';
import { setLocalStorage } from './setLocalStorage';
import * as strings from 'WebPartFootbalEventsWebPartStrings';

import styles from './WebPartFootbalEvents.module.scss';

export default class WebPartFootbalEvents extends React.Component<IWebPartFootbalEventsProps, IWebPartFootbalEventsState> {

  public state = {
    arrayFootbalEventsApi: [],
    arrayItemsList: [],
    userName: ''
  };

  public componentDidMount(): void {
    this._getUserData();
  }

  public componentWillMount(): void {
    if (localStorage.getItem(arrayEventsApi) === null
      && localStorage.getItem(arrayItemsListCalendar) === null) {
      this._getArrayEventsWithApi();
      this._getItemsList();
    } else {
      this.getLocalStorageEventsApi();
      this.getLocalStorageListCalendar();
    }
  }

  public updateData(config: any) {
    this.setState(config, () => {
      if (this.state.arrayItemsList === [] || this.state.arrayItemsList.length === 0) {
        this.getLocalStorageListCalendar();
      }
    });
  }

  private getLocalStorageListCalendar(): void {
    const json: string | null = localStorage.getItem(arrayItemsListCalendar);
    const arrayListCalendar = JSON.parse(json);
    const timeNow = new Date();
    const minus = +timeNow - arrayListCalendar.time;
    if (minus < minut15) {
      this.setState({
        arrayItemsList: arrayListCalendar.array
      });
    } else {
      this._getItemsList();
    }
  }

  private getLocalStorageEventsApi(): void {
    const json: string | null = localStorage.getItem(arrayEventsApi);
    const arrayEventApi = JSON.parse(json);
    const nowDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (arrayEventApi['0'].dateEvent === nowDate) {
      this.setState({
        arrayFootbalEventsApi: arrayEventApi
      });
    } else {
      this._getArrayEventsWithApi();
    }
  }

  private _getArrayEventsWithApi(): void {
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlApi)}`)
      .then((response) => response.json())
      .then((dataRespo) => this.setState({
        arrayFootbalEventsApi: dataRespo.events
      }, () => setLocalStorage(this.state.arrayFootbalEventsApi, arrayEventsApi)));
  }

  private _getItemsList(): void {
    fetch(`${urlTenant}/search/_api/search/query?querytext='${idListCalendar}'&selectproperties='ListItemID%2c+Title%2c+EventsRollUpStartDate%2c+titleCategory%2c+titleProfileName%2cidUnicEvent'&clienttype='ContentSearchRegular'`,
      {
        method: 'get',
        headers: {
          'accept': "application/json;odata=nometadata",
          'content-type': "application/json;odata=nometadata",
        }
      }).then((response) => response.json())
      .then((data) => data.PrimaryQueryResult.RelevantResults.Table.Rows)
      .then((resp) => {
        this._mapArrayItems(resp);
      });
  }


  private _mapArrayItems(arrayData: Array<any>): void {
    const filterArrayEvents = arrayData.filter((item) => item.Cells[3].Value !== titleListCalendar);
    const dataMap: Array<any> = [];
    filterArrayEvents.forEach((item) => {
      dataMap.push({
        Title: item.Cells[3].Value,
        EventDate: item.Cells[4].Value,
        profilename: item.Cells[6].Value,
        categorySport: item.Cells[5].Value,
        IdItem: item.Cells[2].Value,
        idEventCaml: item.Cells[7].Value
      });
      this.setState({
        arrayItemsList: dataMap
      }, () => setLocalStorage(this.state.arrayItemsList, arrayItemsListCalendar));
    });
  }

  private _getUserData(): void {
    this.props.context.getClient().then((client: MSGraphClient): void => {
      client.api('/me').get((error, user: MicrosoftGraph.User, rawResponse?: any) => {
        if (error) {
          console.error(error);
          return;
        }
        this.setState({
          userName: user.displayName
        });
      });
    });
  }


  public render(): React.ReactElement<IWebPartFootbalEventsProps> {
    const { arrayFootbalEventsApi, arrayItemsList, userName } = this.state;
    return (
      <div className={styles.webPartFootbalEvents}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.container_title_img_wp}>
              <img className={styles.logo_wp} src={require('./img/logo_webpart.png')} width="60" height="60" alt="logoWP" />
              <h1 className={styles.title_webpart}><span className={styles.title_webpart_span}>{strings.TitleWebPartSpan}</span><br /> {strings.TItleWebPartLeague}</h1>
            </div>
            {arrayFootbalEventsApi.length >= 1 ? <FootballEventsList userName={userName}
              arrayEvents={arrayFootbalEventsApi} context={this.props.context} update={this.updateData.bind(this)} /> : null}
            {arrayItemsList.length >= 1 ? <ItemsListCalendar arrayItemsList={arrayItemsList} /> : null}
          </div>
        </div>
      </div>
    );
  }
}
