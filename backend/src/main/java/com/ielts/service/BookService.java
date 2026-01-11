package com.ielts.service;

import com.ielts.dto.BookResponse;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

    public List<BookResponse> listBooks() throws IOException {
        Resource[] resources = resolver.getResources("classpath:/books/*.pdf");
        return Arrays.stream(resources)
                .filter(Resource::exists)
                .map(r -> {
                    String filename = r.getFilename();
                    String display = filename != null ? filename.replace('_', ' ').replaceAll("(?i)\\.pdf$", "") : filename;
                    return new BookResponse(filename, display);
                })
                .collect(Collectors.toList());
    }

    public Resource getBookPdfResource(String fileName) {
        if (fileName == null || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\\\")) {
            throw new IllegalArgumentException("Invalid file name");
        }
        String path = "books/" + fileName;
        ClassPathResource resource = new ClassPathResource(path);
        if (!resource.exists()) {
            throw new IllegalArgumentException("PDF not found: " + fileName);
        }
        return resource;
    }
}
