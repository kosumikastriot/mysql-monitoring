package org.ubt.mysqlmonitoring.schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.ubt.mysqlmonitoring.data.DataResult;
import org.ubt.mysqlmonitoring.data.DataResultDBMS;
import org.ubt.mysqlmonitoring.repository.MonitoringRepository;
import org.ubt.mysqlmonitoring.ws.MessageManager;

@Component
public class MysqlMonitoringSchedule {

    @Autowired
    private MessageManager messageManager;

    @Autowired
    private MessageManager messageManager2;

    @Autowired
    private MonitoringRepository monitoringRepository;

    @Scheduled(fixedDelay = 1000)
    public void getDataMonitoring(){
        DataResult dataResult = new DataResult();
        dataResult.setServerUptime(monitoringRepository.getServerUptime());
        dataResult.setServerMemoryAllocated(monitoringRepository.getServerMemoryAllocated());
        dataResult.setThreadsConnected(monitoringRepository.getThreadsConnected());
        dataResult.setThreadsRunning(monitoringRepository.getThreadsRunning());
        dataResult.setBytesSent(monitoringRepository.getBytesSent());
        dataResult.setBytesReceived(monitoringRepository.getBytesReceived());
        messageManager.sendMessage(dataResult);
    }

    @Scheduled(fixedDelay = 1000)
    public void getDataMonitoringForDBMS(){
        DataResultDBMS dataResult = new DataResultDBMS();
        dataResult.setSchemaDiskSpace(monitoringRepository.getSchemaDiskSpace());
        dataResult.setLastSelectQueries(monitoringRepository.getLastSelectQueries());
        dataResult.setLastInsertQueries(monitoringRepository.getLastInsertQueries());
        dataResult.setLastUpdateQueries(monitoringRepository.getLastUpdateQueries());
        dataResult.setLastDeleteQueries(monitoringRepository.getLastDeleteQueries());
        dataResult.setSlowQueriesNumber(monitoringRepository.getSlowQueriesNumber());
        dataResult.setTopSlowQueries(monitoringRepository.getTopSlowQueries());
        dataResult.setClientQueriesNumber(monitoringRepository.getClientQueriesNumber());
        messageManager2.sendMessageForDBMS(dataResult);
    }
}
