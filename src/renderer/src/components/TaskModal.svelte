<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";

  export let title: string;
  export let action: string = title;

  export function showModal(title: string, details: string, date: string) {
    titleField = title;
    detailsField = details;
    dateField = date;
    modal.showModal();
  }

  export function close() {
    modal.close();
  }

  let modal: Modal;

  let titleField: string;
  let detailsField: string;
  let dateField: string;

  const dispatch = createEventDispatcher();
</script>

<Modal {title} bind:this={modal}>
  <div class="flex flex-col gap-2">
    <input
      type="text"
      placeholder="Title"
      class="input input-bordered placeholder-neutral-500"
      bind:value={titleField}
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
