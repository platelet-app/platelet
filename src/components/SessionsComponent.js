import React from 'react'

class Sessions extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <center><h1>Sessions</h1></center>
                {this.props.sessions.map((session) => (
                    <div>
                        <div>
                            <h5>{session}</h5>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default Sessions;