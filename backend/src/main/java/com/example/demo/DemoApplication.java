package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;


/**
 * This is a demo application that provides a RESTful API for a simple ToDo list
 * without persistence.
 * The endpoint "/" returns a list of tasks.
 * The endpoint "/tasks" adds a new unique task.
 * The endpoint "/delete" suppresses a task from the list.
 * The task description transferred from the (React) client is provided as a
 * request body in a JSON structure.
 * The data is converted to a task object using Jackson and added to the list of
 * tasks.
 * All endpoints are annotated with @CrossOrigin to enable cross-origin
 * requests.
 *
 * @author luh
 */

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
class TaskController {
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(0);


  @GetMapping
  public List<Task> getTasks() {
    log.info("API EP GET /api/tasks → {} items", tasks.size());
    return tasks;
  }

  @PostMapping
  public Task addTask(@RequestBody Task task) {
      long id = idCounter.incrementAndGet();
      task.setId(id);
      log.info("API EP POST /api/tasks: assigning id={} to new task {}", id, task);
      tasks.add(task);
      return task;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
      log.info("API EP DELETE /api/tasks/{} aufgerufen", id);
      boolean removed = tasks.removeIf(t -> t.getId().equals(id));
      return removed
          ? ResponseEntity.noContent().build()
          : ResponseEntity.notFound().build();
  }

  @PostMapping("/reset")
  public ResponseEntity<Void> resetAll() {
    log.info("API EP POST /api/tasks/reset");
    tasks.clear();
    return ResponseEntity.noContent().build();
  }
}

