package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

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

@OpenAPIDefinition(
    info = @Info(
        title = "Todo App",
        version = "1.0",
        description = "Dokumentation der Backend-Schnittstellen"
    )
)

 @CrossOrigin(
        origins = { "http://localhost:3000" // React‑Dev‑Server
				},
        methods = { RequestMethod.GET, RequestMethod.POST,
                    RequestMethod.DELETE, RequestMethod.OPTIONS },
        allowedHeaders = "*"
)
@RestController
@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}

@RestController
@RequestMapping(TaskController.API_BASE)
class TaskController {
    public static final String API_BASE = "/api/tasks";
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(0);


  @GetMapping
  public List<Task> getTasks() {
    log.info("API EP GET {} → {} items", API_BASE, tasks.size());
    return tasks;
  }

  @PostMapping
  public Task addTask(@RequestBody Task task) {
      long id = idCounter.incrementAndGet();
      task.setId(id);
      log.info("API EP POST {}: assigning id={} to new task {}", API_BASE, id, task);
      tasks.add(task);
      return task;
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
      log.info("API EP DELETE {}/{} aufgerufen", API_BASE, id);
      boolean removed = tasks.removeIf(t -> t.getId().equals(id));
      return removed
          ? ResponseEntity.noContent().build()
          : ResponseEntity.notFound().build();
  }

  @PostMapping("/reset")
  public ResponseEntity<Void> resetAll() {
    log.info("API EP POST {}/reset", API_BASE);
    tasks.clear();
    return ResponseEntity.noContent().build();
  }
}

@RestController
@RequestMapping(TaskController1.API_BASE)
class TaskController1 {
    public static final String API_BASE = "/api/v1/tasks";
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(0);

  @GetMapping
  public ResponseEntity<List<Task>> getTasks() {
    log.info("API EP GET {} → {} items", API_BASE, tasks.size());
    return ResponseEntity.ok(tasks); // 200
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> getTask(@PathVariable Long id) {
    for (Task t : tasks) {
        if (t.getId().equals(id)) {
            return ResponseEntity.ok(t); // 200
        }
    }
    return ResponseEntity.notFound().build(); // 404
  }

  @PostMapping
  public ResponseEntity<Task> addTask(@RequestBody Task task) {
      long id = idCounter.incrementAndGet();
      task.setId(id);
      log.info("API EP POST {}: assigning id={} to new task {}", API_BASE, id, task);
      tasks.add(task);
      URI location = URI.create(API_BASE + "/" + id);
      return ResponseEntity.created(location).body(task); // 201 Created + Body
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
      log.info("API EP DELETE {}/{} aufgerufen", API_BASE, id);
      boolean removed = tasks.removeIf(t -> t.getId().equals(id));
      return removed
          ? ResponseEntity.noContent().build() // 204
          : ResponseEntity.notFound().build(); // 404
  }

  @PostMapping("/reset")
  public ResponseEntity<Void> resetAll() {
    log.info("API EP POST {}/reset", API_BASE);
    tasks.clear();
    return ResponseEntity.noContent().build(); // 204
  }
}
