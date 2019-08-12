import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {Typography} from "@material-ui/core";
import React from "react";

class UserProfile extends React.Component {
    componentDidMount() {
        if (this.props.user_uuid === undefined) {
            this.props.api_control.users.whoami()
                .then((my_data) => {
                    console.log(my_data)
                    this.setState({user_profile: my_data});
                })
        }
    }

    state = {
        user_profile: {
            username: "",
            address: {
                town: "",
                country: ""
            }
        }
    };

    render() {

        console.log(this.state.user_profile)

        return (
            <div>
                <h1>Profile</h1>
                <p>{this.state.user_profile.username}</p>
                <p>{this.state.user_profile.address.town}</p>
                <p>{this.state.user_profile.address.country}</p>
            </div>
        )
    }
}

export default UserProfile;