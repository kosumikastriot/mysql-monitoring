package org.ubt.mysqlmonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MysqlMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(MysqlMonitoringApplication.class, args);
    }

}
