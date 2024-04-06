<script lang="ts">
  import { listIndex } from "../lib/stores";

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
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]">
    <List
      {tasks}
      on:action={(e) => {
        window.electron.ipcRenderer.send("archived:unarchive", $listIndex, e.detail);
      }}
      showPastDue={false}
    >
      <span slot="action"><TablerArrowBackUp></TablerArrowBackUp></span>
    </List>
    <button
      class="btn btn-sm self-center"
      on:click={() => {
        console.log($listIndex)
        window.electron.ipcRenderer.send("clear:archive");
      }}>Clear</button
    >
  </div>
</Modal>
