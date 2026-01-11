package com.ielts.service;

import com.ielts.entity.NotificationSettings;
import com.ielts.entity.User;
import com.ielts.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    @Transactional(readOnly = true)
    public NotificationSettings getSettings(User user) {
        return notificationSettingsRepository.findByUser(user).orElseGet(() -> {
            NotificationSettings s = new NotificationSettings();
            s.setUser(user);
            s.setPushNotificationsEnabled(false);
            s.setEmailUpdatesEnabled(false);
            return s;
        });
    }

    @Transactional
    public NotificationSettings updateSettings(User user, Boolean pushEnabled, Boolean emailEnabled) {
        NotificationSettings s = notificationSettingsRepository.findByUser(user).orElseGet(() -> {
            NotificationSettings ns = new NotificationSettings();
            ns.setUser(user);
            ns.setPushNotificationsEnabled(false);
            ns.setEmailUpdatesEnabled(false);
            return ns;
        });

        if (pushEnabled != null) s.setPushNotificationsEnabled(pushEnabled);
        if (emailEnabled != null) s.setEmailUpdatesEnabled(emailEnabled);

        return notificationSettingsRepository.save(s);
    }
}
