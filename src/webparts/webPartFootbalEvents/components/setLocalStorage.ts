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