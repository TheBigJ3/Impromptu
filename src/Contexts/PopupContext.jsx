import { AnimatePresence, motion } from "motion/react";
import { p, table } from "motion/react-client";
import { createContext, use, useContext, useReducer, useRef } from "react";


function popupReducer(state, action) {
    // WARNING: DOES NOT UPDATE STATE    
    function setPopupFromQueue() {
        // Check if there is a current popup 
        // if there is a current popup, compare the priority of the current popup with the first popup in the queue
        if (state.currentPopup?.content) {
            const current = state.currentPopup;
            const nextPopup = state.popupQueue[0]

            // If the current popup has a higher priority than the next popup, do nothing
            if (current.priority >= nextPopup.priority) {
                return;
            }

            // If the current popup has a lower priority than the next popup, add current popup back to the queue and set the current popup to the next popup
            state.popupQueue.shift();
            state.popupQueue.unshift(current);
            state.currentPopup = nextPopup;
        }

        // If there is no current popup, set the current popup to the first popup in the queue
        if (!state.currentPopup?.content && state.popupQueue.length > 0) {
            state.currentPopup = state.popupQueue[0];
            state.popupQueue.shift();
        }
    }

    function addPopupToQueue(popup) {
        // If the popup is bypassed, show it immediately
        if (popup.bypass) {
            // if there is a current popup, place it back in queue in first position
            if (state.currentPopup?.content) {
                state.popupQueue.unshift(state.currentPopup);
            }

            // set the current popup to the new popup
            state.currentPopup = {
                priority: 999,
                content: popup.content
            };

        } else {
            // get the highest index of the same priority
            let index = 0;

            for (let i = 0; i < state.popupQueue.length; i++) {
                if (state.popupQueue[i].priority > popup.priority) {
                    break;
                }

                index = i;
            }
            state.popupQueue.splice(index + 1, 0, popup);
        }


        setPopupFromQueue();


        // Update state
        return {
            ...state,
        };
    }

    function closePopup() {
        // If there is a popup close it
        if (state.currentPopup?.content) {
            state.currentPopup = {};
        }

        // if there is no current popup and there is a popup in queue, set the current popup to the first popup in the queue
        setPopupFromQueue()
        return {
            ...state
        }
    }

    switch (action.type) {
        case "show_popup":
            return addPopupToQueue({
                content: action.popup.content,
                priority: action.popup.priority,
                bypass: action.popup.bypass
            });

        case "close_popup":
            return closePopup();
    }


}

// -- Create Context --
const PopupContext = createContext();


// -- PopupContext Provider --
export const PopupContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(popupReducer, {
        popupQueue: [], // In order of priority
        currentPopup: {}, // 1: Popup Priority, Popup
    });



    const overlayMouseDownInside = useRef(false);

    const handleOverlayMouseDown = (e) => {
        // Only set true if mousedown is on the overlay (not the popup content)
        if (e.target.classList.contains('popup-overlay')) {
            overlayMouseDownInside.current = true;
        } else {
            overlayMouseDownInside.current = false;
        }
    };

    const handleOverlayMouseUp = (e) => {
        // Only close if both mouse down and up are on the overlay
        if (
            overlayMouseDownInside.current &&
            e.target.classList.contains('popup-overlay')
        ) {
            dispatch({ type: "close_popup" });
        }
        overlayMouseDownInside.current = false;
    };


    return (
        <PopupContext.Provider value={{ state, dispatch }}>
            <AnimatePresence>
                {state.currentPopup?.content && (
                    <div
                        onMouseDown={handleOverlayMouseDown}
                        onMouseUp={handleOverlayMouseUp}
                        className="absolute w-full h-full z-[1000] flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: .7 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: 'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 1) 100%)',
                            }}
                            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                        />
    
                        <div className="absolute inset-0 flex items-center justify-center popup-overlay">
                            {state.currentPopup?.content}
                        </div>
                    </div>
                )
                }
            </AnimatePresence>

            {children}
        </PopupContext.Provider >
    )
}

export function usePopup() {
    const ctx = useContext(PopupContext);
    if (!ctx) throw new Error("usePopup must be used within a PopupProvider.");
    const { state, dispatch } = ctx;


    const showPopup = (popup, priority = 1, bypass = false) => {
        dispatch({
            type: "show_popup",
            popup: {
                content: popup,
                priority: priority,
                bypass: bypass
            }
        });
    }



    const closePopup = (conditionFunction) => {
        if (conditionFunction && conditionFunction(state.currentPopup)) {
            dispatch({ type: "close_popup" });
        } else {
            dispatch({ type: "close_popup" });
        }

    }

    return [
        showPopup,
        closePopup
    ]
}