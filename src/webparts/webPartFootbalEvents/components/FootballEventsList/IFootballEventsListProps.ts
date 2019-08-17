import { WebPartContext  } from "@microsoft/sp-webpart-base";

export interface Events {
    idEvent: string;
  
    dateEvent: string;
    strTime: string;
    strDate: string;
  
    strAwayTeam: string;
    strHomeTeam: string;
    
    strEvent: string;
    strLeague: string;

    strSport: string;
  }
  
  export interface IFootballEventsListProps {
    arrayEvents : Events[];
    userName: string;
    context: WebPartContext;
  }