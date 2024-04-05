<script lang="ts">
  import TablerX from "~icons/tabler/x";

  let modal: HTMLDialogElement;

  export let title: string;

  export function showModal(): void {
    modal.showModal();
  }

  export function close(): void {
    modal.close();
  }

  export function isOpen(): boolean {
    return modal.open;
  }
</script>

<dialog class="modal" bind:this={modal} on:close>
  <div class="modal-box overflow-hidden">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        ><TablerX></TablerX></button
      >
    </form>
    <h2 class="font-bold text-lg mb-2">{title}</h2>
    <slot />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
