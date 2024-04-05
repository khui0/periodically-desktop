<script lang="ts">
  import Modal from "./Modal.svelte";

  let modal: Modal;

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Lists" bind:this={modal}>
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]"></div>
</Modal>
