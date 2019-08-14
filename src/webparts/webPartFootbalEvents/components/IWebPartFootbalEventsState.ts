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
    arrayFootbalEventsApi : Events[];
    userName: string;
    arrayItemsList: Array<any>;
  }