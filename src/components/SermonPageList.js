import React from 'react';
import { List } from './List';
import { observer } from 'mobx-react';

const SermonPageList = observer(class extends React.Component {

    onPageClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.pageList.setPage(indexes[0]);
    };


    render() {
        let pages = this.props.pageList.pages || [];
        const options = pages.map((page, index) => ({
            id: index + '',
            text: page.title + '',
            altText: ""
        }));
    
        return ( 
            <div className="sermonPageList">
                <div className="ListHeader">Pages:</div>
                <List onUpdate={this.onPageClick} options={options} />
            </div>
        )
    }
});

export { SermonPageList };