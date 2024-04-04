<script lang="ts">
  import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
  import { endOfToday, getTime, timeToString } from "./lib/time";
  import pluralize from "pluralize";
  import Modal from "./components/Modal.svelte";

  import TablerDots from "~icons/tabler/dots";
  import TablerArchive from "~icons/tabler/archive";
  import TablerShare2 from "~icons/tabler/share-2";
  import TablerSettings from "~icons/tabler/settings";
  import TablerCheck from "~icons/tabler/check";

  interface Task {
    uuid: string;
    title: string;
    details?: string;
    timestamp: string;
  }

  let tasks: Task[] = [];

  // Update clock
  let currentTime: string = getTime();
  setInterval(() => {
    currentTime = getTime();
  }, 1000);

  let title: string;
  let details: string;
  let date: string;
  resetInputs();

  let inputBar: HTMLInputElement;
  let createModal: Modal;
  let createFocusTarget: HTMLInputElement;
  let editModal: Modal;

  function resetInputs(): void {
    title = "";
    details = "";
    date = endOfToday();
  }

  function showCreateModal(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      createModal.showModal();
      createFocusTarget.focus();
    }
  }

  function createNewTask(): void {
    window.electron.ipcRenderer.send("task:create", {
      title: title,
      details: details,
      date: date,
    });
  }

  window.electron.ipcRenderer.send("get:list");

  window.electron.ipcRenderer.on("task:status", (_event, res: string | null) => {
    if (res) {
      resetInputs();
      createModal.close();
    }
  });

  window.electron.ipcRenderer.on("task:list", (_event, res: Task[]) => {
    tasks = res;
  });

  document.addEventListener("keydown", () => {
    const hasModalOpen: boolean = Boolean(document.querySelector(`dialog[open]`));
    if (!hasModalOpen && document.activeElement.tagName !== "input") {
      inputBar.focus();
    }
  });
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
  <OverlayScrollbarsComponent
    element="span"
    class="h-full"
    options={{ scrollbars: { autoHide: "scroll", theme: "os-theme-light" } }}
    defer
    ><ol class="flex flex-col gap-2">
      {#each tasks as task}
        {@const match = task.title.match(/^([A-z0-9]+):(.+)$/)}
        <li class="bg-base-200 hover:cursor-pointer p-3 rounded-box flex flex-row gap-2">
          <div class="flex flex-col gap-1 justify-center">
            <button class="btn btn-sm btn-square"><TablerCheck></TablerCheck></button>
          </div>
          <div class="flex flex-col justify-evenly">
            <h2 class="text-xl">
              {#if match}
                <span class="badge badge-outline align-middle">{match[1]}</span>
                {match[2]}
              {:else}
                {task.title}
              {/if}
            </h2>
            {#if task.details}
              <p class="text-neutral-content">{task.details}</p>
            {/if}
            <p class="text-neutral-500">{timeToString(task.timestamp)}</p>
          </div>
        </li>
      {/each}
    </ol></OverlayScrollbarsComponent
  >
  <div class="flex flex-row gap-2">
    <input
      type="text"
      class="input input-bordered input-sm w-full placeholder-neutral-500"
      placeholder="Create task"
      bind:value={title}
      bind:this={inputBar}
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
      <button class="btn btn-primary btn-sm" on:click={createNewTask}>Create</button>
    </div>
  </Modal>
  <Modal title="Edit" bind:this={editModal}>
    <div class="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        class="input input-bordered placeholder-neutral-500"
        bind:value={title}
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
      <button class="btn btn-primary btn-sm" on:click={createNewTask}>Create</button>
    </div>
  </Modal>
</main>
