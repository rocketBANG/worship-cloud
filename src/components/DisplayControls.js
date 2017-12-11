import React from 'react'
import {setDisplayVerseIndex} from '../store/actions'
import {connect} from 'react-redux'

class DisplayControlsInternal extends React.Component {

    render() {
        let{currentVerseIndex, onVerseChange} = this.props;
        return (
            <div className="DisplayControls">
                <button onClick={() => onVerseChange(currentVerseIndex - 1)}>Previous</button>
                <button onClick={() => onVerseChange(currentVerseIndex + 1)}>Next</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentVerseIndex: state.display.currentVerseIndex
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onVerseChange: verseIndex => {
            dispatch(setDisplayVerseIndex(verseIndex))
        }
    }
}

const DisplayControls = connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayControlsInternal)

export default DisplayControls
