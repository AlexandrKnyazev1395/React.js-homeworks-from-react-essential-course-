var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: [],
            searchedNotes: []
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes, searchedNotes: localNotes });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes, searchedNotes: newNotes });
        this.clearSearchField();
        
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes, searchedNotes: newNotes });
        this.clearSearchField();
    },

    handleNotesSearched: function(displayedNotes) {
        this.setState({ searchedNotes: displayedNotes });
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesSearch notes={this.state.notes} searchNotes={this.handleNotesSearched}/>
                <NotesGrid notes={this.state.searchedNotes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    },

    clearSearchField: function () {
        var searchField = document.getElementsByClassName('search-field')[0];
        searchField = document.getElementsByTagName('input');
        searchField[0].value = '';
    }
});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            color: '#FFFF00'
        };
    },

    handleTextChange: function(event) {
        this.setState({ text: event.target.value });
    },

    handleColorChange: function(event) {
        this.setState({ color: event.target.value });
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({ text: '' });
    },

    render: function() {
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <div id="chooseColor">
	                <span>Choose color:</span>
	                <input type="color" defaultValue="#FFFF00" onChange={this.handleColorChange} />
	            </div>
                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        );
    }
});

var NotesSearch = React.createClass({

    handleSearch: function (event) {
        var notes = this.props.notes;
        var searchQuery = event.target.value.toLowerCase();
        var displayedNotes = notes.filter(function(el) {
            var searchValue = el.text.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });
        this.props.searchNotes(displayedNotes);
    },

    render: function () {
        return (
            <div className="search-field">
                <input type="text" placeholder="Enter text for search note..."  onChange={this.handleSearch} />
            </div>
        );
    }
})

var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete;

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    }
});

var Note = React.createClass({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>
                {this.props.children}
            </div>
        );
    }
});



ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);