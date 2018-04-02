import React from 'react';
import "./TabFrame.css"

class TabFrame extends React.Component {

    state = {
        currentTab: 0
    }

    onTabClick = (tabIndex) => {
        this.setState({currentTab: tabIndex});
    }

    render() {
        let {tabs} = this.props;
        let {currentTab} = this.state;

        const tabButtons = tabs.map((t, i) => {
            return (
                <div className={(i === currentTab ? "selected" : "") + " tabButton"} onClick={() => this.onTabClick(i)} key={i}>{t.name}</div>
            );
        });

        return (
            <div className="TabFrame">
                <div className="TabFrameViewer">
                    {tabs[currentTab].component}
                </div>
                <div className="TabFrameControls">
                    {tabButtons}
                </div>
            </div>
        );
    }
}

export { TabFrame };