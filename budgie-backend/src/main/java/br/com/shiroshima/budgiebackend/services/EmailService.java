package br.com.shiroshima.budgiebackend.services;

import java.util.Map;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(subject);
        message.setTo(to);
        message.setText(content);
        javaMailSender.send(message);
    }

    @Async
    public void sendNewSigninEmail(String to, String name) {
        sendEmailTemplate(to, "Novo Cadastro - Budgie", "novoCadastro", Map.of("name", name));
    }

    private void sendEmailTemplate(String to, String subject, String template, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);

        String templateString = templateEngine.process(template, context);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(templateString, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("ERRO ao enviar mensagem");
        }
    }
}
