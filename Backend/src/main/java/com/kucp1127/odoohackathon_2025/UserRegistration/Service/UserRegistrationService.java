package com.kucp1127.odoohackathon_2025.UserRegistration.Service;


import com.kucp1127.odoohackathon_2025.EmailService.EmailService;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.FacilityOwnerProfile;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.FacilityOwnerProfileRepository;
import com.kucp1127.odoohackathon_2025.UserRegistration.ENUM.Role;
import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import com.kucp1127.odoohackathon_2025.UserRegistration.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserRegistrationService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private FacilityOwnerProfileRepository facilityOwnerProfileRepository;

    public Optional<UserRegistrationsModel> findRegistrationByUsername(String username) {
        return userRepository.findById(username);
    }

    public UserRegistrationsModel register(UserRegistrationsModel userRegistrationModel) {
        UserRegistrationsModel userRegistrationsModel = userRepository.save(userRegistrationModel);
        if(userRegistrationModel.getRole()== Role.ROLE_FACILITY_OWNER){
            String subject = "QuickCourt Registration - Verification Pending";
            String body = "Hello " + userRegistrationsModel.getFullName() + ",\n\nThank you for registering as a Facility Owner. Your account is now pending verification from our admin team. We will notify you once your account has been approved.\n\nBest regards,\nThe QuickCourt Team";
            emailService.sendSimpleEmail(userRegistrationsModel.getEmail(), subject, body);
            FacilityOwnerProfile fp = new FacilityOwnerProfile();
            fp.setFacilityIds(new ArrayList<>());
            fp.setEmail(userRegistrationsModel.getEmail());
            facilityOwnerProfileRepository.save(fp);
        }
        else{
            String subject = "Welcome to QuickCourt!";
            String body = "Hello " + userRegistrationsModel.getFullName() + ",\n\nThank you for registering with QuickCourt! You can now start booking sports facilities and joining matches.\n\nBest regards,\nThe QuickCourt Team";
            emailService.sendSimpleEmail(userRegistrationsModel.getEmail(), subject, body);
        }
        return userRegistrationsModel;
    }

    public UserRegistrationsModel updateRegistration(UserRegistrationsModel userRegistrationModel) {
        return userRepository.save(userRegistrationModel);
    }

    public UserRegistrationsModel verifyFacilityProvider(String email) {
        Optional<UserRegistrationsModel> userRegistrationModel = userRepository.findByEmail(email);
        if(userRegistrationModel.isPresent()){
            UserRegistrationsModel userRegistrationsModel = userRegistrationModel.get();
            if(userRegistrationsModel.getRole()== Role.ROLE_FACILITY_OWNER){
                String subject = "QuickCourt Registration - Verification Successful";
                String body = "Hello " + userRegistrationsModel.getFullName() + ",\n\nThank you for registering as a Facility Owner. Your account is now verified from our admin team. We will notify you once your account has been approved.\n\nBest regards,\nThe QuickCourt Team";
                emailService.sendSimpleEmail(userRegistrationsModel.getEmail(), subject, body);
                userRegistrationsModel.setVerified(true);
                return userRepository.save(userRegistrationsModel);
            }
        }
        return null;
    }

    public Object getAllRegistrations() {
        return userRepository.findAll();
    }

    public Boolean banUser(String username) {
        Optional<UserRegistrationsModel> userRegistrationsModel = userRepository.findById(username);
        if(userRegistrationsModel.isPresent()){
            userRegistrationsModel.get().setPassword("@@@@");
            userRepository.save(userRegistrationsModel.get());
            return true;
        }
        return false;
    }

    public String getName(String username){
        Optional<UserRegistrationsModel> userRegistrationsModel = userRepository.findById(username);
        return userRegistrationsModel.map(UserRegistrationsModel::getFullName).orElse(null);
    }
}
