<script lang="ts">
  import Modal from "./Modal.svelte";
  import Versions from "./Versions.svelte";
  import SettingsToggle from "./SettingsToggle.svelte";

  let modal: Modal;

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Settings" bind:this={modal}>
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]">
    <div class="form-control">
      <SettingsToggle id="dark-theme" value="dark" classes="theme-controller" toggled={true}
        >Dark theme</SettingsToggle
      >
      <SettingsToggle id="enable-tray" toggled={true}>Close to tray</SettingsToggle>
      <SettingsToggle id="notifications" toggled={true}>Task notifications</SettingsToggle>
    </div>
    <Versions></Versions>
  </div>
</Modal>
