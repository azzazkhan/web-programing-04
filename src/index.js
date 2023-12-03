const { createInterface } = require('readline');
const { listNotes, saveNote, loadNote } = require('./notes');

const DATASTORE = 'notes';

/**
 * Retrieves input from the user.
 *
 * @param {string} prompt The prompt to show the user
 * @param {Function} callback The callback to call with user's input.
 * @param {string?} response The response to show after accepting input
 */
const getInput = (prompt, callback, response = undefined) => {
    const interface = createInterface({ input: process.stdin, output: process.stdout });

    interface.question(`${prompt} `, (answer) => {
        if (response) {
            console.log(response);
        }

        interface.close();
        callback(answer);
    });
};

/**
 * Processes the provided command.
 *
 * @param {string} command The command to process
 * @return void
 */
const processCommand = (command) => {
    switch (command) {
        case 'save':
            getInput('Please enter new note ID:', (id) => {
                getInput('Please enter new note name:', (name) => {
                    saveNote(id, name, DATASTORE);
                });
            });

            break;
        case 'show':
            getInput('Please enter note ID to show:', (id) => {
                loadNote(id, DATASTORE);
            });

            break;
        case 'list':
            listNotes(DATASTORE);
            break;
        default:
            console.error('Invalid command provided! Available commands are: save, show, list');
    }
};

let command = process.argv[2];

processCommand(command);
