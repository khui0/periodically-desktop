<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  import { endOfToday } from "../lib/time";

  export let title: string;
  export let action: string = title;
  export let focus: boolean = true;

  export let titleField: string = "";
  export let detailsField: string = "";
  export let dateField: string = endOfToday();

  export function showModal(title?: string, details?: string, date?: string) {
    titleField ||= title;
    detailsField ||= details;
    dateField ||= date;
    modal.showModal();
    if (focus) {
      focusTarget.focus();
    }
  }

  export function close() {
    modal.close();
    // Reset fields
    titleField = "";
    detailsField = "";
    dateField = endOfToday();
  }

  const dispatch = createEventDispatcher();

  let modal: Modal;
  let focusTarget: HTMLInputElement;
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
    <button
      class="btn btn-primary btn-sm"
      on:click={() => {
        dispatch("action", { title: titleField, details: detailsField, date: dateField });
      }}>{action}</button
    >
  </div>
</Modal>
