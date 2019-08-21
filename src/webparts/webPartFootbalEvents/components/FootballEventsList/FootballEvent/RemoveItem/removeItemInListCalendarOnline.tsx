import {urlTenant, idListCalendar} from '../../../constans';

export async function  removeItemInListCalendarOnline(id: number): Promise<any> {
    const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
    let web = new Web1(urlTenant);
    let list = web.lists.getById(idListCalendar);
    list.items.getById(id).delete();
}