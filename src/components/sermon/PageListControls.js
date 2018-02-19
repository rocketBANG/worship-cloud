import React from 'react'
import { observer } from 'mobx-react'

const PageListControls = observer(class PageListControls extends React.Component {

    render() {
        
        return (
            <div className="PageListControls">
                <button onClick={this.props.addPage}>+</button>
            </div>
        )    
    }
});

export default PageListControls;