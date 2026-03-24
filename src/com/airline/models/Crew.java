package com.airline.models;

public class Crew {
    private int crewId;
    private String name;
    private String role;
    public int getCrewId() {
        return crewId;
    }
    public void setCrewId(int crewId) {
        this.crewId = crewId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public Crew(int crewId, String name, String role) {
        this.crewId = crewId;
        this.name = name;
        this.role = role;
    }
}