import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { IWebPartFootbalEventsProps } from './IWebPartFootbalEventsProps';
import {IWebPartFootbalEventsState, Events} from './IWebPartFootbalEventsState';
import FootbalEventsList from './FootbalEventsList/FootbalEventsList';
import ItemsListCalendar from './ItemsListCalendar/ItemsListCalendar';


import styles from './WebPartFootbalEvents.module.scss';


export default class WebPartFootbalEvents extends React.Component<IWebPartFootbalEventsProps, IWebPartFootbalEventsState> {

  public state = {
    arrayFootbalEventsApi: [],
    arrayItemsList: [],
    userName: ''
  };

  public componentDidMount() : void {
    this._getItemsList();
    this._getUserData();
  }

  public componentWillMount(): void {
    if (localStorage.getItem("arrayEventsApi") === null) {
        this._getArrayEventsWithApi();
    } else {
         this.getLocalStorage();
    }
  }

  public getLocalStorage() : void {
    const json: string | null  = localStorage.getItem("arrayEventsApi");
    const arrayEventsApi = JSON.parse(json);
    this.setState({
      arrayFootbalEventsApi: arrayEventsApi
    })
  }

  public setLocalStorage( eventsApi:Events[] ) : void {
    const arrayEventsApi = JSON.stringify(this.state.arrayFootbalEventsApi);
    localStorage.setItem("arrayEventsApi", arrayEventsApi);
  }

  private _getArrayEventsWithApi() : void {
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328')}`)
      .then((response) => response.json())
      .then( (dataRespo) => this.setState({
        arrayFootbalEventsApi: dataRespo.events 
      }, () => this.setLocalStorage(this.state.arrayFootbalEventsApi)));
  }

  private _getItemsList() : void {
    fetch("https://mihasev28wmreply.sharepoint.com/search/_api/search/query?querytext='30289322-d788-4219-9783-02a984721df8'&selectproperties='Title%2c+EventsRollUpStartDate%2c+titleCategory%2c+titleProfileName'&clienttype='ContentSearchRegular'", 
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
    const filterArrayEvents = arrayData.filter((item) => item.Cells[2].Value !== 'Communication site - TenantListFootball');
    console.log(filterArrayEvents);
    const dataMap: Array<any> = [];
    filterArrayEvents.forEach((item) => {
        dataMap.push({
            Title: item.Cells[2].Value,
            StartDate: item.Cells[3].Value,
            ProfileName: item.Cells[5].Value,
            Category: item.Cells[4].Value
        });
        this.setState({
            arrayItemsList: dataMap
        });
    });
}

  private _getUserData(): void {
    this.props.context.msGraphClientFactory.getClient().then((client: MSGraphClient): void => {
        client.api('/me').get((error, user: MicrosoftGraph.User, rawResponse?: any) => {
            if (error) {
                console.error(error);
                return;
            }
            this.setState({
                userName: user.displayName,
            });
        });
    });
}

  
  public render(): React.ReactElement<IWebPartFootbalEventsProps> {
    const {arrayFootbalEventsApi, arrayItemsList, userName} = this.state;

    return (
      <div className={ styles.webPartFootbalEvents }>
        <div className={ styles.container }>
          <div className={styles.row}>
            <div className={styles.container_title_img_wp}>
              <img className={styles.logo_wp} src={require('./img/logo_webpart.png')} width="60" height="60" alt="logoWP"/>
              <h1 className={styles.title_webpart}><span className={styles.title_webpart_span}>English</span><br/> Premier League</h1>
            </div>

            {arrayFootbalEventsApi.length >= 1 ? <FootbalEventsList userName={userName} 
            arrayEvents={arrayFootbalEventsApi} context={this.props.context} /> : null}
            {arrayItemsList.length >= 1 ? <ItemsListCalendar arrayItemsList={arrayItemsList} /> : null}
          </div>
        </div>
      </div>
    );
  }
}
