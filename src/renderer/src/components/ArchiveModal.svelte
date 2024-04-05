<script lang="ts">
  import Modal from "./Modal.svelte";
  import List from "./List.svelte";

  import TablerArrowBackUp from "~icons/tabler/arrow-back-up";

  let modal: Modal;

  interface Task {
    uuid: string;
    title: string;
    details: string | undefined;
    timestamp: string;
  }

  export let tasks: Task[] = [];

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Archive" bind:this={modal}>
  <div class="flex flex-col gap-2">
    <List
      {tasks}
      on:action={(e) => {
        window.electron.ipcRenderer.send("archived:unarchive", e.detail);
      }}
      showPastDue={false}
    >
      <span slot="action"><TablerArrowBackUp></TablerArrowBackUp></span>
    </List>
  </div>
</Modal>
