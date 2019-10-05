import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import {convertDate} from '../utilities'

export default class toggleTimeStamp extends React.Component {
    state = {
        selected: false,
    };

    render() {
        return (
            <div>
                {this.props.label}
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
                <CheckIcon/>
            </ToggleButton>
                </div>
        );

    }
}