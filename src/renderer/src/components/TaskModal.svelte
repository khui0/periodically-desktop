<script lang="ts">
  import { listIndex } from "../lib/stores";
  import { createEventDispatcher, onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import { endOfToday } from "../lib/time";

  import TablerTrash from "~icons/tabler/trash";

  export let title: string;
  export let action: string = title;
  export let focus: boolean = true;
  export let showDelete: boolean = false;

  export let titleField: string = "";
  export let detailsField: string = "";
  export let dateField: string = endOfToday();

  const dispatch = createEventDispatcher();

  let modal: Modal;
  let focusTarget: HTMLInputElement;

  let taskUUID: string;

  export function show(): void {
    modal.showModal();
    if (focus) {
      focusTarget.focus();
    }
  }

  export function fill(uuid: string, title: string, details: string, date: string): void {
    taskUUID = uuid;
    titleField = title;
    detailsField = details;
    dateField = date;
  }

  export function close(): void {
    modal.close();
    resetFields();
  }

  export function isOpen(): boolean {
    return modal?.isOpen();
  }

  // Dispatch action event on Ctrl + Enter
  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (isOpen()) {
        if (e.ctrlKey && e.key === "Enter") {
          dispatchAction();
        }
      }
    });
  });

  function dispatchAction(): void {
    dispatch("action", {
      uuid: taskUUID,
      title: titleField,
      details: detailsField,
      date: dateField,
    });
    close();
  }

  function deleteTask(): void {
    window.electron.ipcRenderer.send("task:delete", $listIndex, taskUUID);
    close();
  }

  function resetFields(): void {
    titleField = "";
    detailsField = "";
    dateField = endOfToday();
  }
</script>

<Modal {title} bind:this={modal} on:close>
  <div class="flex flex-col gap-2">
    <input
      type="text"
      placeholder="Title"
      class="input input-bordered"
      bind:value={titleField}
      bind:this={focusTarget}
    />
    <textarea
      class="textarea textarea-bordered resize-none w-full block"
      placeholder="Details"
      bind:value={detailsField}
    ></textarea>
    <input
      type="datetime-local"
      placeholder="Title"
      class="input input-bordered"
      bind:value={dateField}
    />
    <div class="flex gap-2">
      {#if showDelete}
        <button class="btn hover:btn-error btn-sm btn-square" on:click={deleteTask}
          ><TablerTrash></TablerTrash></button
        >
      {/if}
      <button class="btn btn-primary btn-sm flex-1" on:click={dispatchAction}>{action}</button>
    </div>
  </div>
</Modal>
