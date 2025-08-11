package com.kucp1127.odoohackathon_2025.UserRegistration.Controller;

import com.kucp1127.odoohackathon_2025.SecurityConfiguration.JwtService;
import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import com.kucp1127.odoohackathon_2025.UserRegistration.Service.UserRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserRegistrationController {

    @Autowired
    private UserRegistrationService userRegistrationService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    private final BCryptPasswordEncoder bCryptPasswordEncoder= new BCryptPasswordEncoder(12);



    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationsModel userRegistrationModel) {

        Optional<UserRegistrationsModel> userRegistration2 = userRegistrationService.findRegistrationByUsername(userRegistrationModel.getEmail());

        if (userRegistration2.isPresent()) {
            return ResponseEntity.badRequest().body("Username is already in use");
        }

        userRegistrationModel.setPassword(bCryptPasswordEncoder.encode(userRegistrationModel.getPassword()));

        UserRegistrationsModel userRegistrationModel1 = userRegistrationService.register(userRegistrationModel);
        if(userRegistrationModel1 != null){
            return ResponseEntity.ok().build();
        }
            return ResponseEntity.internalServerError().body("Could not register user");
    }


    @GetMapping("login")
    public ResponseEntity<?> login(@RequestParam("email") String email, @RequestParam("password") String password) {

        Authentication authentication = authenticationManager.
                authenticate(new UsernamePasswordAuthenticationToken(email, password));

        if(authentication.isAuthenticated()){
            String s= jwtService.generateToken(email);
            System.out.println(s);
            return ResponseEntity.ok(s);
        }
        return ResponseEntity.badRequest().body("Either Wrong credentials or Internal server error ");
    }

    @GetMapping("data/{username}")
    public ResponseEntity<?> getData(@PathVariable String username) {
        Optional<UserRegistrationsModel> userRegistrationModel = userRegistrationService.findRegistrationByUsername(username);
        if (userRegistrationModel.isPresent()) {
            return ResponseEntity.ok(userRegistrationModel.get());
        }
        return ResponseEntity.internalServerError().build();
    }

    @PutMapping("updateRegistration")
    public ResponseEntity<?> updateRegistration(@RequestBody UserRegistrationsModel userRegistrationModel) {
        UserRegistrationsModel userRegistrationModel1 = userRegistrationService.updateRegistration(userRegistrationModel);
        if(userRegistrationModel1 != null){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().body("Could not update user try again later");
    }

    @PutMapping("/verify")
    public ResponseEntity<?> verifyRegistration(@RequestBody UserRegistrationsModel userRegistrationModel) {
        UserRegistrationsModel userRegistrationModel1 = userRegistrationService.verifyFacilityProvider(userRegistrationModel.getEmail());
        if(userRegistrationModel1 != null){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().body("Could not verify user try again later");
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRegistrationService.getAllRegistrations());
    }

    @PostMapping("/ban")
    public ResponseEntity<?> banUser(@RequestParam String username) {
        return ResponseEntity.ok(userRegistrationService.banUser(username));
    }

    @GetMapping("/getName")
    public ResponseEntity<?> getName(@RequestParam String username) {
        return ResponseEntity.ok(userRegistrationService.getName(username));
    }

}
