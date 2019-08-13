import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import {sp} from "@pnp/sp";
import * as strings from 'WebPartFootbalEventsWebPartStrings';
import WebPartFootbalEvents from './components/WebPartFootbalEvents';
import { IWebPartFootbalEventsProps } from './components/IWebPartFootbalEventsProps';

export interface IWebPartFootbalEventsWebPartProps {
}

export default class WebPartFootbalEventsWebPart extends BaseClientSideWebPart<IWebPartFootbalEventsWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
        sp.setup({
            spfxContext: this.context.pageContext.web.absoluteUrl
        });
    });
}

  public render(): void {
    const element: React.ReactElement<IWebPartFootbalEventsProps > = React.createElement(
      WebPartFootbalEvents,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
