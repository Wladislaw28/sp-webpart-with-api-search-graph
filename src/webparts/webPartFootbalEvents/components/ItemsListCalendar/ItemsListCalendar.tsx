import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import {IItemsListCalendarProps} from './IItemsListCalendarProps';
import {IItemsListCalendarState} from './IItemsListCalendarState';

import styles from '../WebPartFootbalEvents.module.scss';

export default class ItemsListCalendar extends React.Component<IItemsListCalendarProps,IItemsListCalendarState> {

    public state = {
        columns: []
    };

    public componentDidMount() : void {
        this._columsCreate(['IdItem','Title','EventDate','profilename','categorySport']);
    }

    private _columsCreate(arraySelect: Array<any>): void {
        const columns: IColumn[] = [];
        arraySelect.forEach((item,index) => {
            columns.push({
                key: `column${index}`,
                name: item,
                fieldName: item,
                minWidth: 120,
                maxWidth: 140,
                isResizable: true,
            });
        });
        this.setState({
            columns
        });
    }

    public render(): React.ReactElement<{}>{
        return(
            <div className={styles.container_detailist}>
                <DetailsList items={this.props.arrayItemsList}
                                     columns={this.state.columns}
                                     setKey="set"
                                     layoutMode={DetailsListLayoutMode.justified}
                                     isHeaderVisible={true}
                                     selectionPreservedOnEmptyClick={true}
                                     enterModalSelectionOnTouch={true}
                                     ariaLabelForSelectionColumn="Toggle selection"
                                     ariaLabelForSelectAllCheckbox="Toggle selection for all items" />
                </div>
        );
    }
}