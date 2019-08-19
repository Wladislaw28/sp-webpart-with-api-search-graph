import { MSGraphClientFactory } from '@microsoft/sp-http';

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
    context: MSGraphClientFactory;
    update: (any) => any;
  }