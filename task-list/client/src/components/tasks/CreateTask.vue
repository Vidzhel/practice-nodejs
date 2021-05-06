<template>
  <h2>Create new task</h2>
  <div class="container">
    <div class="input">
      <input-text
        v-model="taskDescription"
        :class="['p-inputtext-sm', { 'p-invalid': isShowError }]"
        placeholder="Task description"
        @blur="inputTouched"
      />
      <div class="error" v-show="isShowError">
        {{ this.invalid }}
      </div>
    </div>
    <Button
      classs="p-button-sm"
      label="Create"
      :disabled="isCreateDisabled"
      :loading="isLoading"
      @click="createTask"
    />
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import TaskService from "../../services/TaskService";

export default {
  components: {
    InputText,
    Button
  },
  emits: ["task-created"],
  data() {
    return { taskDescription: "", isLoading: false, isInputTouched: false };
  },
  computed: {
    invalid() {
      if (this.taskDescription.length < 5) {
        return "Description should be at least 5 symbols long";
      }

      return "";
    },
    isCreateDisabled() {
      return this.isInvalid || this.isLoading;
    },
    isInvalid() {
      return !!this.invalid;
    },
    isShowError() {
      return this.isInputTouched && this.isInvalid;
    }
  },
  methods: {
     async createTask() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      await TaskService.createTask({
        description: this.taskDescription
      })
        .then(response => {
          this.$emit("task-created", response.data);
        })
        .catch(e => (this.invalid = e.message));

      this.isLoading = false;
    },
    inputTouched() {
      this.isInputTouched = true;
    }
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container .input {
  margin-right: 10px;
}

.container .input .error {
  color: red;
  width: 170px;
  overflow-wrap: break-word;
}
</style>