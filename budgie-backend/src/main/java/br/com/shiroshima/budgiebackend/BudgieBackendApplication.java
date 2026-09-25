package br.com.shiroshima.budgiebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BudgieBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgieBackendApplication.class, args);
    }

}
