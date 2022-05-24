import createNote from './create-note';
import deleteNote from './delete-note';
import getNoteById from './get-note-by-id';
import listNotes from './list-note';
import { Note } from './note';
import updateNote from './update-note';


type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        noteId: string,
        note: Note
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getNoteById":
            return getNoteById(event.arguments.noteId);
        case "createNote":
            return createNote(event.arguments.note);
        case "listNotes":
            return listNotes();
        case "deleteNote":
            return deleteNote(event.arguments.noteId);
        case "updateNote":
            return updateNote(event.arguments.note);
        default:
            return null;
    }
}