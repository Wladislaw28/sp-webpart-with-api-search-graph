import { WebPartContext  } from "@microsoft/sp-webpart-base";

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
    context: WebPartContext;
}