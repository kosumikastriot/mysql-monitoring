package org.ubt.mysqlmonitoring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ubt.mysqlmonitoring.repository.MonitoringRepository;

import java.util.List;

@Service
public class MonitoringService {

    @Autowired
    private MonitoringRepository monitoringRepository;

//    public Long getServerUptime(){
//        List<Object[]> dbResult = monitoringRepository.getServerUptime();
//
//        return Long.parseLong(String.valueOf(dbResult.get(0)[1]));
//    }
}
