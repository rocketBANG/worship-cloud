import React from 'react';
import "./TabFrame.css"

class TabFrame extends React.Component {

    state = {
        currentTabs: [ 0 ]
    }

    onTabClick = (tabIndex) => {
        let newCurrentTabs = [tabIndex];
        if(this.props.multiple) {
            newCurrentTabs = this.state.currentTabs;
            if(newCurrentTabs.indexOf(tabIndex) > -1) {
                newCurrentTabs = newCurrentTabs.filter(i => i !== tabIndex);
            } else {
                newCurrentTabs.push(tabIndex);
            }
        }
        this.props.keepOrder && newCurrentTabs.sort();
        
        this.setState({currentTabs: newCurrentTabs});
    }

    render() {
        let {tabs} = this.props;
        let {currentTabs} = this.state;

        const tabButtons = tabs.map((t, i) => {
            return (
                <div className={(currentTabs.indexOf(i) > -1 ? "selected" : "") + " tabButton"} onClick={() => this.onTabClick(i)} key={i}>{t.name}</div>
            );
        });

        return (
            <div className="TabFrame">
                <div className="TabFrameViewer">
                    {currentTabs.map((t, i) => React.cloneElement(tabs[t].component, {key: i}))}
                </div>
                <div className="TabFrameControls">
                    {tabButtons}
                </div>
            </div>
        );
    }
}

export { TabFrame };