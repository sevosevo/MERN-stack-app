import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid';

export const setAlert = (msg, alertType, time = 2000) => dispatch => {
    const id = uuid.v4();

     dispatch({
        type: SET_ALERT,
        payload: {
            msg,
            alertType,
            id
        }
     });

     setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), time);
};

/* or
export const setAlert = (msg, alertType) => ({
    type: SET_ALERT,
    payload: {
        msg,
        alertType,
        id: uuid.v4()
    }
});
*/












