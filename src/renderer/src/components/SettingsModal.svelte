<script lang="ts">
  import Modal from "./Modal.svelte";

  let modal: Modal;

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Settings" bind:this={modal}></Modal>
