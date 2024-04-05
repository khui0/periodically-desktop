<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import { endOfToday } from "../lib/time";

  export let title: string;
  export let action: string = title;
  export let focus: boolean = true;

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

  export function fill(uuid?: string, title?: string, details?: string, date?: string): void {
    taskUUID = uuid;
    title && (titleField = title);
    details && (detailsField = details);
    date && (dateField = date);
  }

  export function close(): void {
    modal.close();
    // Reset fields
    titleField = "";
    detailsField = "";
    dateField = endOfToday();
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
</script>

<Modal {title} bind:this={modal} on:close>
  <div class="flex flex-col gap-2">
    <input
      type="text"
      placeholder="Title"
      class="input input-bordered placeholder-neutral-500"
      bind:value={titleField}
      bind:this={focusTarget}
    />
    <textarea
      class="textarea textarea-bordered placeholder-neutral-500 resize-none w-full block"
      placeholder="Details"
      bind:value={detailsField}
    ></textarea>
    <input
      type="datetime-local"
      placeholder="Title"
      class="input input-bordered placeholder-neutral-500"
      bind:value={dateField}
    />
    <button class="btn btn-primary btn-sm" on:click={dispatchAction}>{action}</button>
  </div>
</Modal>
