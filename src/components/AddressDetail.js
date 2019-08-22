import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";

export default class AddressDetailsCollapsible extends React.Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }


    classes = makeStyles(theme => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }));

    state = {
        ward: "",
        line1: "",
        line2: "",
        town: "",
        county: "",
        postcode: "",
        country: "",
        locations: [],
        suggestions: []
    };

    onSelect(selectedItem) {
        let result = this.state.locations.filter(location => location.name === selectedItem);
        console.log(this.state.locations);
        console.log(result);

        if (result.length === 1){
            console.log(result[0]['line1']);
        this.setState({
                line1: result[0]['address']['line1']
            }

        );
            console.log(this.state.line1)
        }
        else {
            this.setState({
                line1: ""
            })
        }
    }

    componentDidMount() {
        this.props.apiControl.locations.getLocations().then((data) => {
            this.setState({locations: data});
            let filtered_suggestions = [];
            this.state.locations.map((location) => {
                filtered_suggestions.push({"label": location.name})
            });
            this.setState({suggestions: filtered_suggestions})
        });

    }

    render() {
        return (
            <div className={this.classes.root}>
                <FavouriteLocationsSelect id="addressSelect" suggestions={this.state.suggestions} onSelect={this.onSelect}/>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography className={this.classes.heading}>{this.props.label} Address</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextField
                                margin="dense"
                                id="ward"
                                label="Ward"
                                type="text"
                                value={this.state.ward}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line1"
                                label="Address Line 1"
                                type="text"
                                value={this.state.line1}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line2"
                                label="Address Line 2"
                                type="text"
                                value={this.state.line2}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="town"
                                label="Town"
                                type="text"
                                value={this.state.town}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="county"
                                label="County"
                                type="text"
                                value={this.state.county}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="postcode"
                                label="Postcode"
                                type="text"
                                value={this.state.postcode}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="Country"
                                label="Country"
                                type="text"
                                value={this.state.country}
                                fullWidth
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}
