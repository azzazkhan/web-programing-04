const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

/**
 * Generates the JSON datastore filename from provided input.
 *
 * @param {string} name Name of the file without extension
 * @return {string}
 */
const getDatastoreFilename = (name) => `${name}.json`;

/**
 * Checks if the JSON datastore file exists and creates one if none exists.
 *
 * @param {string} name Name of the file without extension.
 * @return {boolean}
 */
const ensureDatastoreExists = (name = 'notes') => {
    if (typeof name !== 'string') {
        throw new TypeError('The [name] parameter must be a string!');
    }

    const filename = getDatastoreFilename(name);
    const filepath = join(__dirname, '..', filename);

    if (!existsSync(filepath)) {
        try {
            writeFileSync(filepath, JSON.stringify([]));
            console.info(`Created ${filename} datastore`);
        } catch (error) {
            console.error(`Unable to create ${filename} datastore!`);
            return false;
        }
    }

    return true;
};

/**
 * @typedef {Object} Note
 * @property {int} id The ID of the note
 * @property {string} name The name of the note
 */

/**
 * Reads all notes from the provided JSON datastore.
 *
 * @param {*} name Name of the file without extension.
 * @return {void}
 */
exports.loadNotes = (name = 'notes') => {
    if (!ensureDatastoreExists(name)) {
        return;
    }

    const filename = getDatastoreFilename(name);

    try {
        const contents = readFileSync(filename, { encoding: 'utf-8' });

        /** @type {Note[]} */
        const notes = JSON.parse(contents);

        console.info(`Reading all notes from datastore ${filename}...\n`);

        notes.forEach((note) => {
            console.log(`Note ID: ${note.id}, Note Name: ${note.name}`);
        });

        console.info('\nAll notes have been read successfully');
    } catch (error) {
        console.error(`An error occurred while reading ${filename} datastore!`);
    }
};
