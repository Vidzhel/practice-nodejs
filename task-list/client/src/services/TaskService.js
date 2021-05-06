import Api from "./Api";

export default {
  fetchTasks() {
    return Api().get("tasks");
  },
  updateTask(task) {
    return Api().post(`tasks/update/${task._id}`, task);
  },
  createTask(task) {
    return Api().post("tasks/create", task);
  },
  deleteTask(task) {
    return Api().get("tasks/delete/" + task._id, task);
  },
};
