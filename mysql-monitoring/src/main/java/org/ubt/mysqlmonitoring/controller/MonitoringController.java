package org.ubt.mysqlmonitoring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ubt.mysqlmonitoring.service.MonitoringService;

@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    @Autowired
    private MonitoringService monitoringService;

//    @GetMapping("/get-server-uptime")
//    public ResponseEntity<Long> getServerUptime(){
//        return ResponseEntity.ok().body(monitoringService.getServerUptime());
//    }
}
