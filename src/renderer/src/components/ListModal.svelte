<script lang="ts">
  import { listIndex } from "../lib/stores";

  import Modal from "./Modal.svelte";

  import TablerTrash from "~icons/tabler/trash";
  import TablerPlus from "~icons/tabler/plus";

  let modal: Modal;

  let lists: string[] = [];

  let current: string;

  export function show(): void {
    modal.showModal();
    current = lists[$listIndex];
    console.log(current);
  }

  export function close(): void {
    modal.close();
  }

  window.electron.ipcRenderer.send("req:lists");
  window.electron.ipcRenderer.on("res:lists", (_event, response: string[]) => {
    lists = response;
  });

  function newList(): void {
    window.electron.ipcRenderer.send("list:create");
  }

  function deleteList(): void {
    window.electron.ipcRenderer.send("list:delete", $listIndex);
  }

  function renameList(): void {
    window.electron.ipcRenderer.send("list:rename", $listIndex, current);
  }
</script>

<Modal title="List" bind:this={modal}>
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]">
    <div class="join">
      <button
        class="btn hover:btn-error join-item"
        on:click={deleteList}
        disabled={$listIndex === 0 || null}><TablerTrash></TablerTrash></button
      >
      <input
        type="text"
        class="input input-bordered join-item w-full"
        placeholder="List name"
        bind:value={current}
        on:keydown={(e) => {
          if (e.key === "Enter") {
            renameList();
          }
        }}
        readonly={$listIndex === 0 || null}
      />
      <button class="btn hover:btn-primary join-item" on:click={newList}
        ><TablerPlus></TablerPlus></button
      >
    </div>
  </div>
</Modal>
