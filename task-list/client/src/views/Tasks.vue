<template>
  <div>
    <create-task @task-created="newTaskCreated($event)" />

    <h1>Tasks</h1>

    <DataTable
      :value="tasks"
      responsiveLayout="scroll"
      class="p-datatable-sm"
      editMode="cell"
    >
      <Column field="description" header="Description">
        <template #editor="slotProps">
          <InputText
            v-model="slotProps.data[slotProps.column.props.field]"
            @change="updateTask(slotProps.data)"
          />
        </template>
      </Column>
      <Column field="completed" header="Completed">
        <template #body="slotProps">
          <Checkbox
            v-model="slotProps.data[slotProps.column.props.field]"
            :binary="true"
            @change="updateTask(slotProps.data)"
          ></Checkbox>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button
            label="Delete"
            classs="p-button-sm"
            @click="deleteTask(slotProps.data)"
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import TaskService from "../services/TaskService";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import CreateTask from "../components/tasks/CreateTask";
import Button from "primevue/button";

export default {
  components: {
    DataTable,
    Column,
    InputText,
    Checkbox,
    CreateTask,
    Button
  },
  data() {
    return {
      tasks: []
    };
  },
  mounted() {
    this.getTasks();
  },
  methods: {
    log(data) {
      console.log(data);
    },
    getTasks() {
      TaskService.fetchTasks()
        .then(response => {
          this.tasks = response.data;
        })
        .catch(console.error);
    },
    newTaskCreated(task) {
      this.tasks.unshift(task);
    },
    updateTask(task) {
      TaskService.updateTask(task).catch(e => console.log(e));
    },
    deleteTask(task) {
      TaskService.deleteTask(task)
        .then(() => {
          this.tasks = this.tasks.filter(curr => curr._id !== task._id);
        })
        .catch(e => console.log(e));
    }
  }
};
</script>

<style>
</style>