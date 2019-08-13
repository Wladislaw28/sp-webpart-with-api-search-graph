import * as React from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import styles from './WebPartFootbalEvents.module.scss';
import { IWebPartFootbalEventsProps } from './IWebPartFootbalEventsProps';

export interface Events {
  idEvent: string;

  dateEvent: string;
  strTime: string;
  strDate: string;

  strAwayTeam: string;
  strHomeTeam: string;
  
  strEvent: string;
  strLeague: string;
}

export interface IWebPartFootbalEventsState {
  arrayEvents : Events[];
  userName: string;
}

export default class WebPartFootbalEvents extends React.Component<IWebPartFootbalEventsProps, IWebPartFootbalEventsState> {

  public state = {
    arrayEvents: [],
    userName: ''
  };

  public componentDidMount() : void {
    this._getArrayEventsWithApi();
    this._getItemsList();
    this._getUserData();
  }

  private _getArrayEventsWithApi() : void {
    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328')}`)
      .then((response) => response.json())
      .then( (dataRespo) => this.setState({
        arrayEvents: dataRespo.events 
      }));
  }

  private _getItemsList() : void {
    fetch("https://mihasev28wmreply.sharepoint.com/search/_api/search/query?querytext='80fed460-d7c5-499e-920b-32db6689236e'&clienttype='ContentSearchRegular'", {
      method: 'get',
            headers: {
                'accept': "application/json;odata=nometadata",
                'content-type': "application/json;odata=nometadata",
            }
    }).then((response) => response.json())
        .then((data) => data.PrimaryQueryResult.RelevantResults.Table.Rows)
          .then((resp) => {
            const data = resp;
            console.log(data);
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

  private async addEventListCalendar(e: any, dateEvent: string, strEvent: string, strLeague: string, userName: string ) : Promise<any> {
        e.preventDefault();
        const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
        let web = new Web1(this.props.context.pageContext.web.absoluteUrl + '/sites/Dev1');
        web.lists.getById('80fed460-d7c5-499e-920b-32db6689236e').items.add({
            Title: strEvent,
            // DisplayName: {userName},
            EventsRollUpStartDate: dateEvent,
            DiscussionCategory: strLeague
        }).then((iar) => {
          console.log(iar);
      });
  }
  
  public render(): React.ReactElement<IWebPartFootbalEventsProps> {
    return (
      <div className={ styles.webPartFootbalEvents }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
                <div>
                  {this.state.arrayEvents.map((item) => {
                    return(
                      <div className={ styles.column } key={item.idEvent}>
                          <h1>{item.strEvent}</h1>
                          <h2>{item.dateEvent}</h2>
                          <div>
                            <p>Home team:{item.strHomeTeam}</p>
                            <p>Away team:{item.strAwayTeam}</p>
                          </div>
                          <button className={styles.button} 
                          onClick={(e) => this.addEventListCalendar(e,item.dateEvent, item.strEvent, item.strLeague, this.state.userName )}>Sign Up</button>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
