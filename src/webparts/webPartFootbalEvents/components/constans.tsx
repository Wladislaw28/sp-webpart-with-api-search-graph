export const urlApi = 'https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328';
export const idListCalendar = '30289322-d788-4219-9783-02a984721df8';
export const titleListCalendar = 'Communication site - TenantListFootball';
export const urlTenant = 'https://mihasev28wmreply.sharepoint.com';

export function setLocalStorage(eventsApi, arrayName){
  const arrayLocalSt = JSON.stringify(eventsApi);
  localStorage.setItem(arrayName, arrayLocalSt);
}