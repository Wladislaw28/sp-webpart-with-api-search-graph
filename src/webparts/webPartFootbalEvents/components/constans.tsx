export const urlApi: string = 'https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328';
export const idListCalendar: string = '30289322-d788-4219-9783-02a984721df8';
export const titleListCalendar: string = 'Communication site - TenantListFootball';
export const urlTenant: string = 'https://mihasev28wmreply.sharepoint.com';
export const minut15: number = 900000;

export function setLocalStorage(arrayItems: Array<any>, arrayName: string): void{
  if(arrayName === 'arrayItemsListCalendar') {
    const nowTime = new Date().getTime();

    const arrayLocalStWithDate = {
      time: nowTime,
      array: arrayItems
    };

    const arrayLocalStWithDate1 = JSON.stringify(arrayLocalStWithDate);
    localStorage.setItem(arrayName, arrayLocalStWithDate1);
  } else {
    const arrayLocalSt = JSON.stringify(arrayItems);
    localStorage.setItem(arrayName, arrayLocalSt);
 }
}