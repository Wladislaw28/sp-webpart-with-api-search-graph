import {setLocalStorage} from '../../../setLocalStorage';

export function removeItemInListCalendar(id: string, update:(any) => any ): void {
    const json: string | null  = localStorage.getItem("arrayItemsListCalendar");
    const arrayListCalendar = JSON.parse(json);

    arrayListCalendar.array.splice(id, 1);   
    setLocalStorage(arrayListCalendar.array, 'arrayItemsListCalendar');
    update({newItem: arrayListCalendar.array});
}