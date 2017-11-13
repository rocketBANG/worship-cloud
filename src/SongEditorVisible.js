import {connect} from 'react-redux'
import SongEditor from './SongEditor'
import {updateVerseText} from './store/actions'

function getVerseText(verseId, verses) {
    if(verses[verseId] !== undefined) {
        return verses[verseId].text;
    } else {
        return "";
    }
}

const mapStateToProps = state => {
    return {
        text: getVerseText(state.editor.currentVerse, state.verses.byId),
        verseId: state.editor.currentVerse
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onEdit: (verseId, text) => {
            dispatch(updateVerseText(verseId, text))
        }
    }
}

const SongEditorVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongEditor)



export default SongEditorVisible;
