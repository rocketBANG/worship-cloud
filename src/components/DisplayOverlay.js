import React from 'react'
import { observer } from 'mobx-react'
import '../style/DisplayOverlay.css'

const DisplayOverlay = observer(class DisplayOverlay extends React.Component {

    render() {
        return (
            <div className="DisplayOverlay">
                <div className="overlayPage">{this.props.pageIndicator}</div>
                <div className="overlayBlank">{this.props.blankIndicator}</div>
            </div>
        );
    }
});

export default DisplayOverlay;