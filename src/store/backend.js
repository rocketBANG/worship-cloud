import { INVALIDATE_SONGS, REQUEST_SONGS, RECEIVE_SONGS, SEND_SONGS, SEND_SONGS_DONE } from "./actions";

export function backend(state = {
    isFetching: false,
    didInvalidate: true,
    isPosting: false}
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
                isPosting: true
            })

        case SEND_SONGS_DONE:
            return Object.assign({}, state, {
                isPosting: false
            })

        default:
            return state;
    }
}
