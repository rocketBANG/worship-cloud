import * as React from 'react'
import { observer } from 'mobx-react'
import { Verse } from '../models/songs/Verse';
import { IObservableValue, IObservableArray, computed } from 'mobx';
import { Song } from '../models/songs/Song';
import VerseList from './VerseList';
import { ScrollList } from './general/ScrollList';
import { IListItem } from './general/IListItem';

interface IProps {
    selectedVerses: IObservableArray<Verse>
    currentSong: Song
}

interface IState {
    indexes: number[],
}

@observer class VerseOrderList extends React.Component<IProps, IState> {

    public state = {
        indexes: []
    };

    public componentWillReceiveProps(props: IProps) {
        if(props.currentSong !== this.props.currentSong) {
            this.setState({indexes: []});
        }
    }

    private onVerseClick = (items: IListItem[], indexes: number[]) => {
        this.props.selectedVerses.clear();
        let newVerses = items.map(item => this.props.currentSong.completeVerses.find(v => v.id === item.value));
        this.props.selectedVerses.push(...newVerses);

        this.setState({
            indexes: indexes.slice().sort()
        })

    };

    private onOrderRemove = () => {
        this.props.currentSong.removeFromOrder(this.state.indexes)
        this.setState({indexes: this.state.indexes.filter(i => i < this.props.currentSong.verseOrder.length)});
    };

    private onOrderUp = () => {
        if(this.state.indexes[0] < 1) {
            return;
        }
        this.props.currentSong.reorder(this.state.indexes, -1);
        this.setState({indexes: this.state.indexes.map(i => i - 1)});
    };

    private onOrderDown = () => {
        if(this.state.indexes[this.state.indexes.length - 1] > this.props.currentSong.verseOrder.length - 2) {
            return;
        }
        this.props.currentSong.reorder(this.state.indexes, +1);
        this.setState({indexes: this.state.indexes.map(i => i + 1)});
    };

    @computed private get indexes(): number[] {
        return this.props.selectedVerses.map(item => this.options.findIndex(v => v.value === item.id)).sort();
    }

    @computed private get options() {
        return VerseList.MapVerseToISelectItem(this.props.currentSong, this.props.currentSong && this.props.currentSong.verseOrder);
    }
    
    public render() {
        
        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Order:</div>
                <ScrollList selected={this.state.indexes} onUpdate={this.onVerseClick} items={this.options} />
                <div className="ListControls">
                    <button onClick={this.onOrderUp} >up</button>
                    <button onClick={this.onOrderDown}>down</button>
                    <button onClick={this.onOrderRemove}>x</button>
                </div>
            </div>
        )    
    }
};

export default VerseOrderList;