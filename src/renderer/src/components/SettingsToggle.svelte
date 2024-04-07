<script lang="ts">
  export let toggled: boolean = false;
  export let id: string;
  export let checked: boolean = toggled;

  export let classes: string = "";
  export let value: string = "";

  get(toggled);

  window.electron.ipcRenderer.on(`settings:res-${id}`, (_event, response: string) => {
    checked = response === "true";
  });

  $: checked, set();

  function set(): void {
    const value = checked ? "true" : "false";
    window.electron.ipcRenderer.send("settings:set", id, value);
  }

  function get(defaultValue: boolean): void {
    const value = defaultValue ? "true" : "false";
    window.electron.ipcRenderer.send("settings:get", id, value);
  }
</script>

<label class="label cursor-pointer gap-2">
  <span class="label-text"><slot /></span>
  <input type="checkbox" {value} class="toggle {classes}" bind:checked />
</label>
