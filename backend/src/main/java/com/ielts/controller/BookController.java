package com.ielts.controller;

import com.ielts.dto.BookResponse;
import com.ielts.security.UserPrincipal;
import com.ielts.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookResponse>> listBooks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }
        try {
            List<BookResponse> resp = bookService.listBooks();
            return ResponseEntity.ok(resp);
        } catch (IOException ioe) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{fileName}/pdf")
    public ResponseEntity<InputStreamResource> streamPdf(@PathVariable("fileName") String fileName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        try {
            Resource resource = bookService.getBookPdfResource(fileName);
            String filename = resource.getFilename() != null ? resource.getFilename() : "book.pdf";
            InputStreamResource isr = new InputStreamResource(resource.getInputStream());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(isr);
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.notFound().build();
        } catch (IOException ioe) {
            return ResponseEntity.status(500).build();
        }
    }
}
