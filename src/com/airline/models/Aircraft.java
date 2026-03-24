// Mentioned in one of the documents, probably not needed

package com.airline.models;

public class Aircraft {
    private int aircraftId;
    private String model;
    private int capacity;
    public int getAircraftId() {
        return aircraftId;
    }
    public String getModel() {
        return model;
    }
    public Aircraft(int aircraftId, String model, int capacity) {
        this.aircraftId = aircraftId;
        this.model = model;
        this.capacity = capacity;
    }
    public int getCapacity() {
        return capacity;
    }
    public void setAircraftId(int aircraftId) {
        this.aircraftId = aircraftId;
    }
    public void setModel(String model) {
        this.model = model;
    }
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}