import React from 'react'
import { observer } from 'mobx-react'
import '../style/DisplayOverlay.css'

const DisplayOverlay = observer(class DisplayOverlay extends React.Component {

    render() {
        let pageIndicator = "";
        if(this.props.totalPages > 1) {
            pageIndicator = this.props.currentPage + "/" + this.props.totalPages;
        }
        return (
            <div className="DisplayOverlay">
                <div className="overlayPage">{pageIndicator}</div>
                <div className="overlayBlank">{this.props.blankIndicator}</div>
            </div>
        );
    }
});

export default DisplayOverlay;