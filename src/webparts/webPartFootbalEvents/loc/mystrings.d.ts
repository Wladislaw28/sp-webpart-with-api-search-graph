declare interface IWebPartFootbalEventsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  TitleWebPartSpan:string;
  TItleWebPartLeague: string;

  HomeTeam: string;
  AwayTeam: string;

  TextButtonIntresting: string;
  TextButtonNoIntresting: string;

  TextButtonLetsGo: string;
  TextButtonNoLetsGo: string;
}

declare module 'WebPartFootbalEventsWebPartStrings' {
  const strings: IWebPartFootbalEventsWebPartStrings;
  export = strings;
}
