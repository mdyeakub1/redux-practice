
// selecting DOM element 
const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".addMatch")
const resetBtn = document.querySelector(".reset")


// action constants / identifires
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset";
const ADD_MATCH = "match/add";
const DELETE_MATCH = "match/delete"

// action creators 

// action for incrementing match score
const increment = (payload) => {
    return {
        type: INCREMENT,
        payload
    }
}
// action for incrementing match score
const decrement = (payload) => {
    return {
        type: DECREMENT,
        payload
    }
}
// reset action
const reset = () => {
    return {
        type : RESET
    }
}
// add new match action 
const addMatch = () => {
    return {
        type: ADD_MATCH
    }
}
// delete match action 
const deleteMatch = (matchId) => {
    return {
        type: DELETE_MATCH,
        payload: matchId
    }
}


// initial state
const initialState = [
    {
        id: 1,
        score: 0,
    },
];

// get unique match id 
const nextMatchId = (matches) => {
    const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
    return maxId + 1
};

// create reducer funtion 
function matchReducer(state = initialState, action) {
    //increment score
    if (action.type === INCREMENT) {
        const newMatches = state.map((item) => {
            if (item.id === action.payload.id) {
                return { ...item, score: item.score + Number(action.payload.value) };
            } else {
                return item;
            }
        });
        return newMatches;
    } else if (action.type === DECREMENT) {
        //Decrement score
        const newMatches = state.map((item) => {
            if (item.id === action.payload.id) {
                const newScore = item.score - Number(action.payload.value);
                return { ...item, score: newScore > 0 ? newScore : 0 };
            } else {
                return item;
            }
        });
        return newMatches;
    } else if (action.type === RESET) {
        // Reset score
        const refreshedMatches = state.map((item) => ({ ...item, score: 0 }))
        return refreshedMatches
    } else if (action.type === ADD_MATCH) {
        // Add new Match
        const id = nextMatchId(state);
        return [...state, {id, score: 0}]
    } else if (action.type === DELETE_MATCH) {
        // delete match
        const newMatches = state.filter((match) => match.id !== action.payload);
        return newMatches
    } else { 
        return state;
    }
}

// create store
const store = Redux.createStore(matchReducer)

// handler function 

// increment score handler
const incrementHandler = (id, formEl) =>{
     // get the increment input
    const input = formEl.querySelector(".incrementInput");
    // get value
    const value = Number(input.value)
    console.log(value)
    if (value > 0) {
        store.dispatch(increment({id, value}))
    }
}
 
// decrement score handler
const decrementHandler = (id, formEl) =>{
    // get the increment input
   const input = formEl.querySelector(".decrementInput");
   // get value
    const value = Number(input.value)
    console.log(value)
   if (value > 0) {
       store.dispatch(decrement({id, value}))
   }
}

// delete match handle 
const handleMatchDelete = (matchId) => {
    store.dispatch(deleteMatch(matchId))
}

// add new match on button click
// add new counter 
addMatchBtn.addEventListener("click", () => {
    store.dispatch(addMatch())
});

// reset all match
resetBtn.addEventListener("click", () => {
    store.dispatch(reset())
})

// render function for update ui on each state update
const render = () => {
    const state = store.getState();
    const matchesView = state.map((item) => {
        return `
        <div class="match">
        <div class="wrapper">
            <button class="lws-delete" onclick="handleMatchDelete(${item.id})">
                <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${item.id}</h3>
        </div>
        <div class="inc-dec">
            <form class="incrementForm" onsubmit="event.preventDefault();incrementHandler(${item.id}, this)">
                <h4>Increment</h4>
                <input
                    type="number"
                    name="increment"
                    class="incrementInput"
                />
            </form>
            <form class="decrementForm" onsubmit="event.preventDefault();decrementHandler(${item.id}, this)">
                <h4>Decrement</h4>
                <input
                    type="number"
                    name="decrement"
                    class="decrementInput"
                />
            </form>
        </div>
        <div class="numbers">
            <h2 class="lws-singleResult">${item.score}</h2>
        </div>
    </div>
        `;
    }).join("");
    
    matchContainer.innerHTML = matchesView
}

//render the initial value 
render()