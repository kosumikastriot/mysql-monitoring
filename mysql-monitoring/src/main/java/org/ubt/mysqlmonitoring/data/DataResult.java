package org.ubt.mysqlmonitoring.data;

import lombok.Getter;
import lombok.Setter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DecimalFormat;


public class DataResult {

    @Setter
    private Long maxRamSize = 0L;

    @Getter
    @Setter
    private String serverUptime;

    @Setter
    private Long serverMemoryAllocated = 0L;

    @Setter
    private Long serverCpuLoad;

    @Getter
    @Setter
    private int threadsConnected;

    @Getter
    @Setter
    private int threadsRunning;

    @Setter
    private long diskSize;

    @Setter
    private long diskFreeSpace;

    @Setter
    private double bytesSent;

    @Setter
    private double bytesReceived;


    private static DecimalFormat df = new DecimalFormat("0.000");

    //Max Ram of Server
    public Long getMaxRamSize() throws IOException {
        String[] commands = {"cmd.exe", "/c", "wmic memorychip get capacity"};
        Process proc = Runtime.getRuntime().exec(commands);
        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));

        String s = null;

        while ((s = stdInput.readLine()) != null) {

            if(!s.trim().equals("") && s != null) {
                if(Character.isDigit(s.charAt(0))) {
                    this.maxRamSize += (Long.parseLong(s.trim()));
                }
            }
        }
        return (this.maxRamSize/1024)/1024;
    }

    //RAM Allocation from MySQL
    public Long getServerMemoryAllocated() throws IOException {

        String[] commands = {"cmd.exe", "/c", " wmic os get freephysicalmemory"};

        Process proc = Runtime.getRuntime().exec(commands);
        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));

        String s = null;

        while ((s = stdInput.readLine()) != null) {

            if(!s.trim().equals("") && s != null) {
                if(Character.isDigit(s.charAt(0))) {
                    this.serverMemoryAllocated += (Long.parseLong(s.trim()));
                }
            }
        }
        return (serverMemoryAllocated/1024);
    }

    //Cpu Load
    public long getServerCpuLoad() throws IOException {
        String[] commands = {"cmd.exe", "/c", "wmic cpu get loadpercentage"};
        Process proc = Runtime.getRuntime().exec(commands);
        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));

        String s = null;
        int i =     0;
        while ((s = stdInput.readLine()) != null) {
            if(i==2){
                this.serverCpuLoad = (Long.parseLong(s.trim()));
                break;
            }
            i++;
        }
        return this.serverCpuLoad;
    }

    //Disk Size
    public long getDiskSize() throws IOException {
        String[] commands = {"cmd.exe", "/c", "wmic logicaldisk get size"};
        Process proc = Runtime.getRuntime().exec(commands);
        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));
        long theSize = 0;
        String s = null;
        int i = 0;
        while ((s = stdInput.readLine()) != null) {
            if(!s.trim().equals("") && i > 0) {
                theSize +=(Long.parseLong(s.trim()));
            }
            i++;
        }
        this.diskSize = ((theSize/1024)/1024)/1024;
        return ((theSize/1024)/1024)/1024;
    }

    //Disk Size
    public long getDiskFreeSpace() throws IOException {
        String[] commands = {"cmd.exe", "/c", "wmic logicaldisk get freespace"};
        Process proc = Runtime.getRuntime().exec(commands);
        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(proc.getInputStream()));
        long theSize = 0;
        String s = null;
        int i = 0;
        while ((s = stdInput.readLine()) != null) {
            if(!s.trim().equals("") && i > 0) {
                theSize +=(Long.parseLong(s.trim()));
            }
            i++;
        }

        this.diskFreeSpace = ((theSize/1024)/1024)/1024;
        System.err.println("free size " + this.diskFreeSpace);
        return ((theSize/1024)/1024)/1024;
    }

    public double getBytesSent(){
        String bytesToMegaByte = df.format((bytesSent/1024)/1024);
        return Double.parseDouble(String.valueOf(bytesToMegaByte));
    }

    public double getBytesReceived(){
        String bytesToMegaByte = df.format((bytesReceived/1024)/1024);
        return Double.parseDouble(String.valueOf(bytesToMegaByte));
    }

}
