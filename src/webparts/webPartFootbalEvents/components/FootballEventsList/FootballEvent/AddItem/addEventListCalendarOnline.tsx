import {urlTenant, idListCalendar} from '../../../constans';
import {setLocalStorage} from '../../../setLocalStorage';

export async function  addEventListCalendarOnline(EventDate: string, Event: string,
    Sport: string, Time: string, idCaml: string, username: string, update:(any) => any): Promise<any> {
    const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
    let web = new Web1(urlTenant);
    let newItem = {
        Title: Event,
        profilename: username,
        categorySport: Sport,
        EventDate: EventDate + 'T' + Time,
        EndDate: EventDate + 'T' + Time,
        idEventCaml: idCaml
    };
    web.lists.getById(idListCalendar).items.add(newItem);
    addEventListCalendar(newItem, update);
}

function addEventListCalendar(newItem: object, update:(any) => any): void {
    const json: string | null = localStorage.getItem("arrayItemsListCalendar");
    const arrayListCalendar = JSON.parse(json);

    arrayListCalendar.array.push(newItem);

    setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');
    update({ newItem: arrayListCalendar.array });
}