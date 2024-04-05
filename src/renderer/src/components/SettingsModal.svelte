<script lang="ts">
  import Modal from "./Modal.svelte";
  import Versions from "./Versions.svelte";

  let modal: Modal;

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Settings" bind:this={modal}>
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]">
    <Versions></Versions>
  </div>
</Modal>
