package org.ubt.mysqlmonitoring.data;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


public class DataResultDBMS {

    @Setter
    @Getter
    private List<Object[]> schemaDiskSpace;


}
