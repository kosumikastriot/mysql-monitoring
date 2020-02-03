package org.ubt.mysqlmonitoring.data;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


public class DataResultDBMS {

    @Setter
    @Getter
    private List<Object[]> schemaDiskSpace;

    @Setter
    @Getter
    private List<Object[]> lastSelectQueries;

    @Setter
    @Getter
    private List<Object[]> lastInsertQueries;

    @Setter
    @Getter
    private List<Object[]> lastUpdateQueries;

    @Setter
    @Getter
    private List<Object[]> lastDeleteQueries;

    @Setter
    @Getter
    private List<Object[]> topSlowQueries;

    @Getter
    @Setter
    private int slowQueriesNumber;

    @Getter
    @Setter
    private int clientQueriesNumber;

}
