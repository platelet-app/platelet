import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {convertDate} from '../utilities'

export default class toggleTimeStamp extends React.Component {
    state = {
        selected: this.props.status,
    };

    render() {
        return (
            <div>
            <ToggleButton
                value="check"
                selected={this.state.selected}
                onChange={() => {
                    this.setState({
                            selected: !this.state.selected,

                        }
                        , function () {
                            this.props.onSelect(this.state.selected);
                        }
                    );
                }
                }
            >
                {this.props.label}
            </ToggleButton>
                </div>
        );

    }
}