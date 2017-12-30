import { INVALIDATE_SONGS, REQUEST_SONGS, RECEIVE_SONGS, SEND_SONGS, SEND_SONGS_DONE, SEND_SONGS_ERROR } from "../actions/songActions";

export function backend(state = {
    isFetching: false,
    didInvalidate: true,
    isPosting: 0,
    isError: false}
    , action) {
    switch (action.type) {
        case INVALIDATE_SONGS:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case REQUEST_SONGS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_SONGS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                lastUpdated: action.receivedAt
            })

        case SEND_SONGS:
            return Object.assign({}, state, {
                isPosting: state.isPosting+1
            })

        case SEND_SONGS_DONE:
            return Object.assign({}, state, {
                isPosting: state.isPosting-1
            })

        case SEND_SONGS_ERROR:
            return Object.assign({}, state, {
                isError: true
            })

        default:
            return state;
    }
}