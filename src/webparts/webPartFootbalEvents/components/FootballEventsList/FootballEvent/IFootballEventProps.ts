import { MSGraphClientFactory } from '@microsoft/sp-http';

export interface IFootballEventProps {
    Event: string;
    EventDate: string;
    EventDateForUI: string;
    refactTime: string;
    HomeTeam: string;
    AwayTeam: string;
    Sport: string;
    Time: string;
    League: string;
    update: (any) => any;
    username: string;
    context: MSGraphClientFactory;
}