package com.example.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Repräsentiert ein Todo-Element mit ID, Beschreibung und Status
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Task {

    private Long id;
    private String taskdescription;
    private boolean done;

    public Task() {
        // Default-Konstruktor für Jackson
    }

    public Task(Long id, String taskdescription, boolean done) {
        this.id = id;
        this.taskdescription = taskdescription;
        this.done = done;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskdescription() {
        return taskdescription;
    }

    public void setTaskdescription(String taskdescription) {
        this.taskdescription = taskdescription;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    @Override
    public String toString() {
        return "Task{id=" + id + 
               ", taskdescription='" + taskdescription + '\'' + 
               ", done=" + done + '}';
    }
}
