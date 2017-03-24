/* Doing things with React */

/* 
   This section comprises global functions and variables that are not associated with React 
*/

// initialise a global variable that will be used to store global object state after the DOM
// has loaded. This is the easiest way to work with PersistJS.
var store;

// invoked once the body tag is fully mounted on the DOM. It creates a store and renders our
// first React element.

function load_data() {
  // create a persistent store after body tag - and, since it's the last element, the DOM - is loaded.
  store = new Persist.Store('My Application');
  // create a NotesContainer object (see below) 
  React.render(<NotesContainer />, document.getElementById("note-container"));
}

/* 
   This section comprises the hierarchy of React elements. The topmost elements
   are created first, and each child object is defined thereafter.
*/

// The following is invoked whenever a note is deleted in NotesContainer. See the 
// Issues I Faced section in README for an explanation of why this is necessary. 
// Since Reactelements are not allowed to unmount themselves, an external function
// has to be called to ensure this occurs.

// The refresh() function is named so because it roughly simulates the effect of a
// browser refresh for React's virtual DOM. It unmounts the element and then mounts
// it back, causing React to go through its initial rendering process and not use
// its innate diffing algorithm (which causes problems with note deletion and 
// subsequent ordering - see README).

function refresh(){
  // self-explanatory: the element is unmounted.
  React.unmountComponentAtNode(document.getElementById("note-container"));
  // self-explanatory: the element is mounted and rendered from scratch.
  React.render(<NotesContainer />, document.getElementById("note-container"));
}

// A <NotesContainer /> element. Parent element for all notes; strictly controls
// the addition and deletion of all notes. 

// Props: None.

// States:
//         @ cards: (type: Array of Objects (representing a note. Each object consists
//                   of two properties which both map to type String: 
//                            time (which contains the time the object was created)
//                            description (content of note that the object represents)

var NotesContainer = React.createClass({
    
    // getInitialState is used in the initial render. It is always
    // set to a value of the global object store.
    
    // If there is already a saved global state, we start with that
    // - otherwise, we make sure the global state is empty, NOT null,
    // and start with no cards. 
    getInitialState: function(){
        
        // We want to always keep global store and state in sync -
        // state will ensure the right number of cards is always visible,
        // the global store will ensure their content is preserved. If they
        // are out of sync, bad things will happen.
        
        // This is a crude simulacrum of Flux: in particular, it simulates
        // an event listener by always making sure changes to the global store
        // are reflected in changes to local state.
        
        // if store is null
        if (!store.get("cards")) {
            // set store to an empty array.
             store.set("cards", JSON.stringify([]));
        }
        
        // state is now synchronised with global store.
        return {
            cards: JSON.parse(store.get('cards'))
        };
    },
    
    // when delete button is clicked in a card, remove it from existence.
    // Each card is indexed by a value i, indicating which array position it is.
    deleteNote: function(i){
        
        // set the new state. This triggers a re-render. Not the end of the story,
        // however - see componentDidUpdate to understand what really happens when 
        // a note is deleted. 
        this.setState(
            
            function(previousState, currentProps) {
                
                // copy current state from global store
                var updated_state = JSON.parse(store.get("cards"));

                // remove old element from our copy of current state.
                updated_state.splice(i,1);

                // persist this updated copy in store (in other words, update the global 
                // store)
                store.set('cards',JSON.stringify(updated_state));

                // update state to trigger re-render
                return {
                    cards: updated_state
                };
            });
    },
    
    // if a note deletion event occured, simulate a browser refresh
    // to force the NoteContainer to reflect an accurate ordering.
    // Triggered whenever a change in state occurs, but the refresh()
    // is only called if a node is deleted.
    componentDidUpdate: function(previousProps, previousState){
        // if new state is smaller than old state, refresh!
        if (this.state.cards.length < previousState.cards.length){
            refresh();
        }
    },
    
    // when our add button is clicked, append a new card to our internal state
    // and render.
    addNote: function(){
        
        // update state with a new card. Triggers a re-render.
        this.setState(
            
            function(previousState, currentProps) {
                
                // copy current global state
                var updated_state = JSON.parse(store.get("cards"));
                
                // get time of creation in appropriate format
                var current_time = moment().format("MMM Do YY, hh:mm:ss a")

                // add new object to our copy of global state
                updated_state.push({
                        time: current_time,
                        description: 'Click on this content to edit it!'
                    });

                // persist this updated copy in store (in other words, update the global 
                // store)
                store.set('cards', JSON.stringify(updated_state));
                
                // update state to trigger re-render
                return {
                    cards: updated_state
                };
            });
    },
    
    // Does the hard work of actually rendering a series of notes
    render: function() {
        
        // returns a series of notes and an add button
        
        // this.state.map maps each object in our global array to a
        // NewCard element. It also binds a function call to deleteNote,
        // letting a click in the child propagate to the parent. Each 
        // child note is uniquely identified by a key, which, for our
        // purposes can jut be the object's index in our array.
        
        // since this.props.key is not accessible by a child object,
        // I use the prop index to allow the note to access itself in
        // the global object store.
        
        // The last card (which is not in the global store) is always
        // just a generic 'Add a new card' button.
    
        return (
            <div className="ui three stackable cards">
                  {this.state.cards.map(function(card, i) {
                          return (
                                    <NewCard key = {i} index = {i} deletefunc = {this.deleteNote.bind(this,i)} description = {card.description} time = {card.time} />
                                      );
                  }, this)}
                  <div className="card">
                       <button className="ui primary button" onClick={this.addNote}> Add a new note</button>
                  </div>
            </div>
        );
    }
    
});

// A <NewContainer /> element. Parent element for a <ContentEditable />; child element
// of <NotesContainer />. Represents a note, and renders the card corresponding to that
// note.

// Props: 
//         @ time (type: String. The date/time the note was created. Is passed to a field
//                 that is visible to the user. It serves no other purpose, but needs to 
//                 be a prop because of our refresh() strategy.)
//         @ description (type: String. The content of the note when it is created. Is passed 
//                  to a ContentEditable that is visible - and editable - to the user.)
//         @ deletefunc (type: Function. Always bound to the parent component's deleteNote function, 
//                  which deletes the note when a user presses the link.)
//         @ index (type: Int. Represents the card's position in the global object store.)

// States: None

var NewCard = React.createClass({
    
    // Does the hard work of rendering a single note.

    render: function() {
        
        return (
            <div className="card">
                <div className="content">
                    <div className="meta">
                        <span className="right floated action"><a href = "#" onClick={this.props.deletefunc}>Delete?</a></span>
                        <span className="time">{this.props.time}</span>
                        
                    </div>
                    <ContentEditable refs="description" index = {this.props.index} classname = "description" content = {this.props.description} />
                </div>
            </div>
        );
    }
    
});


// A <ContentEditable /> element. Represents a div that (surprise, surprise) whose content can be edited by the user.
// Changes in the div's content are automatically persisted to global state. Child of <NewCard />.

// Props: 
//         @ classname (type: String. This defines how Semantic UI styles the element. In an earlier iteration,
//                      there used to be two contentEditable divs, one representing the note's title and the 
//                      other its content - specifying classname was a quick way to differentiate between the
//                      two. Now that the title has been retired, we could eliminate this prop - but it is 
//                      useful to keep in case more contentEditables, with unique styling, are needed.
//
//         @ content (type: String. The content of the div when it is created)
//         
//         @ index (type: Int. Represents the parent card's position in the global object store.)

// States: None

var ContentEditable = React.createClass({
    
    // on change in input or loss of focus, update the global store
    handleChange: function(){
        
        // make copy of current state
        var cards = JSON.parse(store.get("cards"));
        
        // update object corresponding to card with textContent inside div
        cards[this.props.index][this.props.classname] = this.getDOMNode(this).textContent;
        
        // update global store with this updated copy
        store.set("cards",JSON.stringify(cards));
    },
    
    // Renders our div. onInput, onBlur events are handled by handleChange
    render: function(){
        return (
            <div className = {this.props.classname} contentEditable="true" onInput = {this.handleChange} onBlur = {this.handleChange}>
            {this.props.content}
            </div>
        );
    }
    
});