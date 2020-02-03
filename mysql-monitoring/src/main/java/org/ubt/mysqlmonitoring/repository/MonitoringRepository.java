package org.ubt.mysqlmonitoring.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Repository
public class MonitoringRepository {

    @Autowired
    private EntityManager entityManager;

    public String getServerUptime(){
        Query query = entityManager.createNativeQuery("select TIME_FORMAT(SEC_TO_TIME(VARIABLE_VALUE ),'%Hh %im') as Uptime " +
                "from performance_schema .GLOBAL_STATUS where VARIABLE_NAME='Uptime'");

        return String.valueOf(query.getSingleResult());
    }

    public Long getServerMemoryAllocated(){
        Query query = entityManager.createNativeQuery(" select * from sys.`x$memory_global_total`");

        Object res = query.getSingleResult();
        return Long.parseLong(String.valueOf(res));
    }

    public int getThreadsConnected(){
        Query query = entityManager.createNativeQuery("show status where `variable_name` = 'Threads_connected'");
        List<Object[]> res = query.getResultList();
        return Integer.parseInt(String.valueOf(res.get(0)[1]));
    }

    public int getThreadsRunning(){
        Query query = entityManager.createNativeQuery("show status where `variable_name` = 'Threads_running'");
        List<Object[]> res = query.getResultList();
        return Integer.parseInt(String.valueOf(res.get(0)[1]));
    }

    public int getBytesSent(){
        Query query = entityManager.createNativeQuery("show status where `variable_name` = 'Bytes_sent'");
        List<Object[]> res = query.getResultList();
        return Integer.parseInt(String.valueOf(res.get(0)[1]));
    }

    public int getBytesReceived(){
        Query query = entityManager.createNativeQuery("show status where `variable_name` = 'Bytes_received'");
        List<Object[]> res = query.getResultList();
        return Integer.parseInt(String.valueOf(res.get(0)[1]));
    }


    //DMBS
    //---------------------------------------------------------------------------------------------------
    public List<Object[]> getSchemaDiskSpace(){
        Query query = entityManager.createNativeQuery("select table_schema \"DB name (table_schema)\", \n" +
                "sum((data_length+index_length)/1024/1024) AS \"DB size in MB\" from \n" +
                "information_schema.tables group by table_schema");
        List<Object[]> res = query.getResultList();
        return res;
    }
}
