import { MSGraphClient, MSGraphClientFactory } from '@microsoft/sp-http';

export function addEventOutlookCalendar(EventDate: string, 
    Event: string, League: string, Time: string, context: MSGraphClientFactory ): void {
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

    context.getClient().then((client: MSGraphClient): void => {
          client.api('/me/events').post({subject,body,start,end}, (error, res) => {
            if (error) {
              console.error(error);
              return;
            }
            alert("Event Added");
        });
    });
  }