const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

/**
 * Generates the JSON datastore filename from provided input.
 *
 * @param {string} name Name of the datastore file without extension
 * @return {string}
 */
const getDatastoreFilename = (name) => `${name}.json`;

/**
 * Gets the fully qualified path of specified datastore filename relative
 * to current script.
 *
 * @param {string} filename Filename of the datastore with extension
 * @return {string}
 */
const getDatastoreFilepath = (filename) => join(__dirname, '..', filename);

/**
 * Checks if the JSON datastore exists and creates one if it doesn't.
 *
 * @param {string} name Name of the datastore file without extension
 * @return {void}
 */
const ensureDatastoreExists = (name = 'notes') => {
    if (typeof name !== 'string') {
        console.error('\nThe [name] parameter must be a string!');
        process.exit(1);
    }

    const filename = getDatastoreFilename(name);
    const filepath = getDatastoreFilepath(filename);

    if (!existsSync(filepath)) {
        try {
            writeFileSync(filepath, JSON.stringify([]));
            console.info(`\nCreated ${filename} datastore`);
        } catch (error) {
            console.error(`\nUnable to create ${filename} datastore!`);
            process.exit(1);
        }
    }
};

/**
 * @typedef {Object} Note
 * @property {int} id The ID of the note
 * @property {string} name The name of the note
 */

/**
 * Prints the provided note on the console.
 *
 * @param {Note} note The note to be printed
 * @return {void}
 */
const printNoteDetails = (note) => {
    console.log(`Note ID: ${note.id}, Note Name: ${note.name}`);
};

/**
 * Retrieves notes from JSON datastore.
 *
 * @param {string} name Name of the datastore file without extension
 * @return {Note[]|undefined}
 */
const getNotesFromDatastore = (name = 'notes') => {
    ensureDatastoreExists(name);

    const filename = getDatastoreFilename(name);

    try {
        const contents = readFileSync(filename, { encoding: 'utf-8' });

        return JSON.parse(contents);
    } catch (error) {
        console.error(`\nAn error occurred while reading ${filename} datastore!`);
        process.exit(1);
    }
};

/**
 * Reads all notes from JSON datastore.
 *
 * @param {*} name Name of the datastore file without extension
 * @return {void}
 */
exports.listNotes = (name = 'notes') => {
    const notes = getNotesFromDatastore(name);

    if (!notes.length) {
        console.info('\nThe datastore does not contain any notes!');
        return;
    }

    console.info(`Reading all notes...\n`);

    notes.forEach((note) => printNoteDetails(note));

    console.info('\nAll notes have been read');
};

/**
 * Loads the note details from JSON datastore.
 *
 * @param {number} id The note ID
 * @param {string} name Name of the datastore file without extension
 */
exports.loadNote = (id, name) => {
    const notes = getNotesFromDatastore(name);

    if (!notes.length) {
        console.info('\nThe datastore does not contain any notes!');
        return;
    }

    const note = notes.find((note) => note.id === id);

    if (!note) {
        console.info('\nCould not find the note with specified ID!');
        return;
    }

    console.log('');

    printNoteDetails(note);
};

/**
 * Save the provided note details in JSON datastore.
 *
 * @param {number} id The ID of the note
 * @param {string} name The name of the note
 * @param {string} datastore Name of the datastore file without extension
 */
exports.saveNote = (id, name, datastore = 'notes') => {
    const notes = getNotesFromDatastore(datastore);

    if (notes.find((note) => note.id === id)) {
        console.log('\nA note with specified ID already exists!');
        return;
    }

    notes.push({ id, name });

    const filename = getDatastoreFilename(datastore);
    const filepath = getDatastoreFilepath(filename);

    try {
        writeFileSync(filepath, JSON.stringify(notes), { encoding: 'utf-8', flush: true });
        console.log('\nThe note was saved successfully!');
    } catch (error) {
        console.error(`\nUnable to save note in ${filename} datastore!`);
        process.exit(1);
    }
};
