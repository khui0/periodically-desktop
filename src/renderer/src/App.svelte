<script lang="ts">
  import { onMount } from "svelte";
  import pluralize from "pluralize";
  import { endOfToday, getTime, timeToISO } from "./lib/time";
  import List from "./components/List.svelte";
  import Modal from "./components/Modal.svelte";
  import TaskModal from "./components/TaskModal.svelte";

  import TablerDots from "~icons/tabler/dots";
  import TablerArchive from "~icons/tabler/archive";
  import TablerShare2 from "~icons/tabler/share-2";
  import TablerSettings from "~icons/tabler/settings";

  interface Task {
    uuid: string;
    title: string;
    details?: string;
    timestamp: string;
  }

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
  resetInputs();

  // Elements
  let createModal: Modal;
  let createFocusTarget: HTMLInputElement;
  let editModal: TaskModal;

  window.electron.ipcRenderer.send("get:list");

  window.electron.ipcRenderer.on("task:status", (_event, result: string | null) => {
    if (result) {
      resetInputs();
      createModal.close();
    }
  });

  window.electron.ipcRenderer.on("task:list", (_event, list: Task[]) => {
    tasks = list;
  });

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      const hasModalOpen: boolean = Boolean(document.querySelector(`dialog[open]`));
      if (e.ctrlKey && e.key === "Enter") {
        createTask();
      } else if (!hasModalOpen && document.activeElement.tagName !== "input") {
        const input = document.getElementById("create-task-input");
        input.focus();
      }
    });
  });

  function resetInputs(): void {
    title = "";
    details = "";
    date = endOfToday();
  }

  function showCreateModal(e: KeyboardEvent): void {
    if (!e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      createModal.showModal();
      createFocusTarget.focus();
    }
  }

  function showEditModal(uuid: string): void {
    const task = tasks.find((task) => task.uuid === uuid);
    const date = timeToISO(task.timestamp);
    editModal.showModal(task.title, task.details, date);
  }

  function createTask(): void {
    window.electron.ipcRenderer.send("task:create", {
      title: title,
      details: details,
      date: date,
    });
  }
</script>

<main class="flex flex-col p-4 gap-2 justify-between h-full">
  <div class="flex flex-row items-center justify-between text-2xl">
    <p>{pluralize("task", tasks.length, true)}</p>
    <div class="flex flex-row gap-2">
      <select class="select select-bordered select-sm max-w-xs">
        <option>Default</option>
      </select>
      <button class="btn btn-sm btn-circle"><TablerDots></TablerDots></button>
    </div>
    <p>{currentTime}</p>
  </div>
  <List
    {tasks}
    on:edit-task={(e) => {
      showEditModal(e.detail);
    }}
  ></List>
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
      <button class="btn btn-sm btn-circle"><TablerArchive></TablerArchive></button>
      <button class="btn btn-sm btn-circle"><TablerShare2></TablerShare2></button>
      <button class="btn btn-sm btn-circle"><TablerSettings></TablerSettings></button>
    </div>
  </div>
  <Modal title="Create" bind:this={createModal}>
    <div class="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        class="input input-bordered placeholder-neutral-500"
        bind:value={title}
        bind:this={createFocusTarget}
      />
      <textarea
        class="textarea textarea-bordered placeholder-neutral-500 resize-none w-full block"
        placeholder="Details"
        bind:value={details}
      ></textarea>
      <input
        type="datetime-local"
        placeholder="Title"
        class="input input-bordered placeholder-neutral-500"
        bind:value={date}
      />
      <button class="btn btn-primary btn-sm" on:click={createTask}>Create</button>
    </div>
  </Modal>
  <TaskModal title="Edit" bind:this={editModal}></TaskModal>
</main>
