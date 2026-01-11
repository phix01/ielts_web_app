package com.ielts.service;

import com.ielts.dto.NoteRequest;
import com.ielts.entity.Note;
import com.ielts.entity.User;
import com.ielts.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> listNotesForUser(User user) {
        return noteRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    public Note createNoteForUser(NoteRequest req, User user) {
        Note note = new Note();
        note.setUser(user);
        note.setTitle(req.getTitle());
        note.setContent(req.getContent());
        note.setIsPublic(req.getIsPublic() != null ? req.getIsPublic() : false);
        return noteRepository.save(note);
    }

    public Note updateNoteForUser(Long id, NoteRequest req, User user) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            throw new IllegalArgumentException("Note not found");
        }
        if (note.getUser() == null || !note.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not authorized to update this note");
        }
        note.setTitle(req.getTitle());
        note.setContent(req.getContent());
        note.setIsPublic(req.getIsPublic() != null ? req.getIsPublic() : note.getIsPublic());
        return noteRepository.save(note);
    }

    public void deleteNoteForUser(Long id, User user) {
        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            throw new IllegalArgumentException("Note not found");
        }
        if (note.getUser() == null || !note.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not authorized to delete this note");
        }
        noteRepository.delete(note);
    }
}
