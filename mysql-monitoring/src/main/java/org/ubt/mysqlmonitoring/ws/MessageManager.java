package org.ubt.mysqlmonitoring.ws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.ubt.mysqlmonitoring.data.DataResult;
import org.ubt.mysqlmonitoring.data.DataResultDBMS;

@Component
public class MessageManager {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate2;

    public void sendMessage(DataResult messageDataResult) {
        try {
            messagingTemplate.convertAndSend("/topic/process", new ObjectMapper().writeValueAsString(messageDataResult));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    public void sendMessageForDBMS(DataResultDBMS messageDataResult) {
        try {
            messagingTemplate2.convertAndSend("/topicDBMS/processDBMS", new ObjectMapper().writeValueAsString(messageDataResult));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
