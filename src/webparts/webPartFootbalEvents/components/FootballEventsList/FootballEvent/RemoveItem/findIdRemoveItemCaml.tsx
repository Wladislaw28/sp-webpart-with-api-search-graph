import {removeItemInListCalendarOnline} from './removeItemInListCalendarOnline';
import {urlTenant, idListCalendar} from '../../../constans';

export async function findIdRemoveItemCaml(Event: string, username: string) {
    const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
    let web = new Web1(urlTenant);
    const xml = `<View><Query><Where><And><Eq><FieldRef Name='profilename'/><Value Type='Text'>${username}</Value></Eq><Eq><FieldRef Name='Title'/><Value Type='Text'>${Event}</Value></Eq></And></Where></Query></View>`;
    web.lists.getById(idListCalendar).getItemsByCAMLQuery({ 'ViewXml': xml }).then((res) => {
        removeItemInListCalendarOnline(res['0'].Id);
    });
}