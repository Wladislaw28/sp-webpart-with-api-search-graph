import * as React from 'react';
import {ISliderEventsProps} from './ISliderEventsProps';
import {ISliderEventsState} from './ISliderEventsState';

import styles from '../WebPartFootbalEvents.module.scss';

  export default class Slider extends React.Component<ISliderEventsProps,ISliderEventsState> {

    public state = {
        counter: 0
    };

    public componentDidMount(): void {
        this._sliceEvents('');
    }

    private _sliceEvents( toggle: string ): void {
        let counter = this.state.counter;
        if (toggle === '+') {
          counter += 3;
        } else if ( toggle === '-' ) {
          counter -= 3;
        } else {
          counter = 0;
        }
        const filterArray = this.props.arrayEvents.slice(counter, counter + 3);
        this.setState({
          counter
        },() => {
            this.props.update({compactEvents: filterArray});
        });
      }

    public render(): React.ReactElement<ISliderEventsProps>{
        return(
            <div>
                <div className={styles.container_slider}>
                    {this.state.counter > 0 ? 
                    <a onClick={() => this._sliceEvents('-')}>
                        <img className={styles.img_slider_next_back} src={require('../img/strelkaLevo.png')} alt="Back" />
                    </a> 
                    : null}
                        <div className={styles.container_null_slider}></div>
                    {this.state.counter === 12 ? null : 
                    <a onClick={() => this._sliceEvents('+')}>
                        <img className={styles.img_slider_next_back} src={require('../img/strelkaPravo.png')} alt="Next" />
                    </a>}
                </div>
            </div>
        );
    }
  }