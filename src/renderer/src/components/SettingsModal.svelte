<script lang="ts">
  import Modal from "./Modal.svelte";
  import Versions from "./Versions.svelte";

  import TablerSun from "~icons/tabler/sun";
  import TablerMoon from "~icons/tabler/moon";

  let modal: Modal;

  let darkTheme: boolean;

  $: darkTheme, window.electron.ipcRenderer.send("theme:set", darkTheme ? "dark" : "light");

  window.electron.ipcRenderer.on("res:theme", (_event, response: "light" | "dark") => {
    darkTheme = response === "dark" ? true : false;
  });

  export function show(): void {
    modal.showModal();
  }
</script>

<Modal title="Settings" bind:this={modal}>
  <div class="flex flex-col gap-2 max-h-[calc(100vh-10.25rem)]">
    <div class="flex flex-col items-center">
      <label class="flex cursor-pointer gap-2 items-center">
        <TablerSun></TablerSun>
        <input
          type="checkbox"
          value="dark"
          class="toggle theme-controller"
          bind:checked={darkTheme}
        />
        <TablerMoon></TablerMoon>
      </label>
    </div>
    <Versions></Versions>
  </div>
</Modal>
