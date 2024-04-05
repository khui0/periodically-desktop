<script lang="ts">
  import { onMount } from "svelte";
  import pluralize from "pluralize";
  import { endOfToday, getTime, timeToISO } from "./lib/time";
  import List from "./components/List.svelte";
  import TaskModal from "./components/TaskModal.svelte";
  import ArchiveModal from "./components/ArchiveModal.svelte";

  import TablerDots from "~icons/tabler/dots";
  import TablerCheck from "~icons/tabler/check";
  import TablerArchive from "~icons/tabler/archive";
  import TablerSettings from "~icons/tabler/settings";

  interface Task {
    uuid: string;
    title: string;
    details: string | undefined;
    timestamp: string;
  }

  let lists: string[] = [];
  let tasks: Task[] = [];
  let currentTime: string = getTime();

  // Update clock and refresh tasks every second
  setInterval(() => {
    currentTime = getTime();
    window.electron.ipcRenderer.send("get:list");
  }, 1000);

  // Create task input values
  let title: string;
  let details: string;
  let date: string;
  resetFields();

  // Modals
  let createModal: TaskModal;
  let editModal: TaskModal;
  let archiveModal: ArchiveModal;

  window.electron.ipcRenderer.send("req:lists");
  window.electron.ipcRenderer.send("req:tasks");

  window.electron.ipcRenderer.on("res:lists", (_event, response: string[]) => {
    lists = response;
  });

  window.electron.ipcRenderer.on("res:tasks", (_event, response: Task[]) => {
    tasks = response;
  });

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      const hasModalOpen: boolean = Boolean(document.querySelector(`dialog[open]`));
      if (hasModalOpen) return;
      if (e.ctrlKey && e.key === "Enter") {
        createTask();
        resetFields();
      }
      if (document.activeElement.tagName !== "input") {
        // Focus input on keydown
        const input = document.getElementById("create-task-input");
        input.focus();
      }
    });
  });

  function resetFields(): void {
    title = "";
    details = "";
    date = endOfToday();
  }

  function showCreateModal(e: KeyboardEvent): void {
    if (!e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      createModal.show();
    }
  }

  function showEditModal(uuid: string): void {
    const task = tasks.find((task) => task.uuid === uuid);
    const date = timeToISO(task.timestamp);
    editModal.show();
    editModal.fill(uuid, task.title, task.details, date);
  }

  function createTask(): void {
    window.electron.ipcRenderer.send("task:create", {
      title: title,
      details: details,
      date: date,
    });
  }

  function editTask(uuid: string, title: string, details: string, date: string) {
    window.electron.ipcRenderer.send("task:edit", {
      uuid,
      title,
      details,
      date,
    });
  }
</script>

<main class="flex flex-col p-4 gap-2 justify-between h-full">
  <div class="flex flex-row items-center justify-between text-2xl">
    <p>{pluralize("task", tasks.length, true)}</p>
    <div class="flex flex-row gap-2">
      <select class="select select-bordered select-sm max-w-xs">
        {#each lists as list, i (i)}
          <option>{list}</option>
        {/each}
      </select>
      <button class="btn btn-sm btn-circle"><TablerDots></TablerDots></button>
    </div>
    <p>{currentTime}</p>
  </div>
  <List
    {tasks}
    on:edit={(e) => {
      showEditModal(e.detail);
    }}
    on:action={(e) => {
      window.electron.ipcRenderer.send("task:delete", e.detail);
    }}
  >
    <span slot="action">
      <TablerCheck></TablerCheck>
    </span>
  </List>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      class="input input-bordered input-sm w-full placeholder-neutral-500"
      id="create-task-input"
      placeholder="Create task"
      bind:value={title}
      on:keydown={showCreateModal}
    />
    <div class="flex flex-row bg-base-200 rounded-full">
      <button class="btn btn-sm btn-circle" on:click={archiveModal.show}
        ><TablerArchive></TablerArchive></button
      >
      <button class="btn btn-sm btn-circle"><TablerSettings></TablerSettings></button>
    </div>
  </div>
  <TaskModal
    title="Create"
    bind:this={createModal}
    bind:titleField={title}
    bind:detailsField={details}
    bind:dateField={date}
    on:action={createTask}
  ></TaskModal>
  <TaskModal
    title="Edit"
    bind:this={editModal}
    on:action={(e) => {
      const task = e.detail;
      editTask(task.uuid, task.title, task.details, task.date);
    }}
  ></TaskModal>
  <ArchiveModal bind:this={archiveModal}></ArchiveModal>
</main>
