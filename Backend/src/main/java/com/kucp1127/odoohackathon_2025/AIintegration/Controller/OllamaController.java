package com.kucp1127.odoohackathon_2025.AIintegration.Controller;


import com.kucp1127.odoohackathon_2025.AIintegration.Service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class OllamaController {

    @Autowired
    private OllamaService ollamaService;

    @GetMapping("/getResponse")
    public ResponseEntity<?> getResponse(@RequestBody String prompt) {
        return ResponseEntity.ok().body(ollamaService.getAnswer(prompt));
    }
}
